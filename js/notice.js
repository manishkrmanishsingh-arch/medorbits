/* =========================================================
   MedOrbit AI Notice Agent
   File: src/index.js
   ========================================================= */

const ALLOWED_CATEGORIES = new Set([
  "admission",
  "private-job",
  "scholarship",
  "entrance-exam",
  "counselling",
  "study-abroad",
  "fee-update",
  "internship",
  "training",
  "institution-notice"
]);

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(runNoticeCollection(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/notices") {
        return getPublishedNotices(request, env);
      }

      if (url.pathname === "/api/subscribe" && request.method === "POST") {
        return subscribeUser(request, env);
      }

      if (url.pathname === "/api/admin/run" && request.method === "POST") {
        if (!isAuthorized(request, env)) {
          return jsonResponse(
            { success: false, message: "Unauthorized" },
            401
          );
        }

        const result = await runNoticeCollection(env);
        return jsonResponse({ success: true, result });
      }

      return jsonResponse({
        success: true,
        service: "MedOrbit AI Notice Agent",
        status: "running"
      });
    } catch (error) {
      console.error(error);

      return jsonResponse(
        {
          success: false,
          message: "Internal service error"
        },
        500
      );
    }
  }
};

/* =========================================================
   Main scheduled process
   ========================================================= */

async function runNoticeCollection(env) {
  const sources = await env.DB.prepare(`
    SELECT *
    FROM sources
    WHERE enabled = 1
    ORDER BY trust_score DESC
  `).all();

  const report = {
    checked: 0,
    discovered: 0,
    saved: 0,
    published: 0,
    rejected: 0,
    errors: []
  };

  for (const source of sources.results || []) {
    report.checked += 1;

    try {
      const documents = await collectSource(source);

      for (const document of documents) {
        report.discovered += 1;

        const notice = await analyseNotice(document, source, env);

        if (!notice || !ALLOWED_CATEGORIES.has(notice.category)) {
          report.rejected += 1;
          continue;
        }

        const saved = await saveNotice(notice, source, env);

        if (!saved.created) {
          continue;
        }

        report.saved += 1;

        if (saved.publicationStatus === "published") {
          report.published += 1;

          await notifyMatchingSubscribers(
            saved.noticeId,
            notice,
            env
          );
        }
      }

      await env.DB.prepare(`
        UPDATE sources
        SET last_checked_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(source.id).run();
    } catch (error) {
      report.errors.push({
        source: source.name,
        message: error.message
      });
    }
  }

  return report;
}

/* =========================================================
   Source collection
   Prefer official APIs and RSS feeds.
   ========================================================= */

async function collectSource(source) {
  const response = await fetch(source.url, {
    headers: {
      "User-Agent":
        "MedOrbitNoticeBot/1.0 (+https://medorbits.in)",
      "Accept":
        "application/json, application/rss+xml, application/xml, text/html"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Source returned HTTP ${response.status}`
    );
  }

  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return parseJsonSource(await response.json(), source);
  }

  const body = await response.text();

  if (
    contentType.includes("application/rss+xml") ||
    contentType.includes("application/xml") ||
    body.trim().startsWith("<?xml")
  ) {
    return parseRssSource(body, source);
  }

  return parseHtmlSource(body, source);
}

function parseJsonSource(data, source) {
  const items =
    Array.isArray(data)
      ? data
      : data.items ||
        data.results ||
        data.notices ||
        data.jobs ||
        [];

  return items.slice(0, 30).map((item) => ({
    title:
      item.title ||
      item.name ||
      item.position ||
      "Untitled notice",

    text:
      item.description ||
      item.summary ||
      item.content ||
      "",

    url:
      item.url ||
      item.link ||
      source.url,

    pdfUrl:
      item.pdfUrl ||
      item.pdf ||
      null,

    publishedDate:
      item.publishedDate ||
      item.date ||
      null
  }));
}

function parseRssSource(xml, source) {
  const items =
    [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)];

  return items.slice(0, 30).map((match) => {
    const block = match[0];

    return {
      title: decodeHtml(
        extractXmlValue(block, "title")
      ),

      text: decodeHtml(
        extractXmlValue(block, "description")
      ),

      url:
        extractXmlValue(block, "link") ||
        source.url,

      pdfUrl: findPdfUrl(block),

      publishedDate:
        extractXmlValue(block, "pubDate") ||
        null
    };
  });
}

function parseHtmlSource(html, source) {
  /*
   * Basic fallback parser.
   * For complex JavaScript-rendered websites, connect
   * Cloudflare Browser Run or an official API.
   */

  const links =
    [...html.matchAll(
      /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
    )];

  return links
    .map((match) => {
      const href =
        new URL(match[1], source.url).toString();

      const title =
        stripHtml(match[2]).trim();

      return {
        title,
        text: title,
        url: href,
        pdfUrl:
          href.toLowerCase().includes(".pdf")
            ? href
            : null,
        publishedDate: null
      };
    })
    .filter((item) =>
      item.title.length >= 12 &&
      /admission|vacancy|recruitment|job|scholarship|counselling|application|notification|notice|exam/i
        .test(item.title)
    )
    .slice(0, 30);
}

/* =========================================================
   AI classification
   ========================================================= */

async function analyseNotice(document, source, env) {
  const prompt = `
You are the verification and classification engine for MedOrbit.

Analyse the following information from an official or approved source.

Return valid JSON only with:
{
  "title": "",
  "summary": "",
  "category": "",
  "organisation": "",
  "location": "",
  "publishedDate": null,
  "closingDate": null,
  "eligibility": "",
  "applicationUrl": "",
  "confidenceScore": 0,
  "isRelevant": true,
  "reason": ""
}

Allowed categories:
admission, private-job, scholarship, entrance-exam,
counselling, study-abroad, fee-update, internship,
training, institution-notice.

Rules:
- Do not invent missing dates, fees, eligibility or links.
- Reject advertisements that appear fraudulent.
- Reject government jobs because MedOrbit currently focuses on private jobs.
- Retain official admission, education and institutional notices.
- Confidence must be 0 to 100.
- A job should be categorized private-job only when a private employer or recruiter is identified.
- If information is incomplete, lower the confidence score.

Source name: ${source.name}
Source trust score: ${source.trust_score}
Source URL: ${source.url}

Document title:
${document.title}

Document text:
${document.text}

Document URL:
${document.url}
`;

  const aiResponse = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct",
    {
      messages: [
        {
          role: "system",
          content:
            "Return strict JSON with no markdown."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 900
    }
  );

  const text =
    aiResponse.response ||
    aiResponse.result ||
    "";

  const parsed = safeJsonParse(text);

  if (!parsed || !parsed.isRelevant) {
    return null;
  }

  return {
    ...parsed,
    title:
      sanitizeText(parsed.title || document.title),

    summary:
      sanitizeText(parsed.summary || ""),

    sourceUrl: document.url,

    officialPdfUrl:
      document.pdfUrl || null,

    confidenceScore:
      Math.max(
        0,
        Math.min(
          100,
          Number(parsed.confidenceScore) || 0
        )
      )
  };
}

/* =========================================================
   Save and publish
   ========================================================= */

async function saveNotice(notice, source, env) {
  const hashInput = [
    notice.title,
    notice.organisation,
    notice.sourceUrl,
    notice.closingDate
  ].join("|");

  const noticeHash =
    await sha256(hashInput);

  const existing =
    await env.DB.prepare(`
      SELECT id
      FROM notices
      WHERE notice_hash = ?
    `).bind(noticeHash).first();

  if (existing) {
    return {
      created: false,
      noticeId: existing.id
    };
  }

  const requiredScore =
    Number(env.AUTO_PUBLISH_SCORE || 90);

  const trustedSource =
    Number(source.trust_score) >= 85;

  const autoPublish =
    trustedSource &&
    notice.confidenceScore >= requiredScore &&
    isFutureOrUnknown(notice.closingDate);

  let storedPdfKey = null;

  if (notice.officialPdfUrl) {
    storedPdfKey =
      await storeOfficialPdf(
        notice.officialPdfUrl,
        noticeHash,
        env
      );
  }

  const result = await env.DB.prepare(`
    INSERT INTO notices (
      notice_hash,
      title,
      summary,
      category,
      organisation,
      location,
      source_url,
      official_pdf_url,
      stored_pdf_key,
      published_date,
      closing_date,
      eligibility,
      application_url,
      confidence_score,
      verification_status,
      publication_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    noticeHash,
    notice.title,
    notice.summary,
    notice.category,
    notice.organisation || "",
    notice.location || "",
    notice.sourceUrl,
    notice.officialPdfUrl,
    storedPdfKey,
    notice.publishedDate,
    notice.closingDate,
    notice.eligibility || "",
    notice.applicationUrl || notice.sourceUrl,
    notice.confidenceScore,
    autoPublish ? "auto-verified" : "review-required",
    autoPublish ? "published" : "draft"
  ).run();

  return {
    created: true,
    noticeId: result.meta.last_row_id,
    publicationStatus:
      autoPublish ? "published" : "draft"
  };
}

async function storeOfficialPdf(pdfUrl, noticeHash, env) {
  try {
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      return null;
    }

    const contentType =
      response.headers.get("content-type") || "";

    if (
      !contentType.includes("application/pdf") &&
      !pdfUrl.toLowerCase().includes(".pdf")
    ) {
      return null;
    }

    const buffer =
      await response.arrayBuffer();

    const maximumSize =
      15 * 1024 * 1024;

    if (buffer.byteLength > maximumSize) {
      return null;
    }

    const key =
      `notices/${new Date().getFullYear()}/${noticeHash}.pdf`;

    await env.DOCUMENTS.put(key, buffer, {
      httpMetadata: {
        contentType: "application/pdf"
      },
      customMetadata: {
        originalUrl: pdfUrl,
        collectedAt: new Date().toISOString()
      }
    });

    return key;
  } catch {
    return null;
  }
}

/* =========================================================
   Client notification
   ========================================================= */

async function notifyMatchingSubscribers(
  noticeId,
  notice,
  env
) {
  const subscribers =
    await env.DB.prepare(`
      SELECT *
      FROM subscribers
      WHERE active = 1
        AND (
          preferred_categories IS NULL
          OR preferred_categories = ''
          OR preferred_categories LIKE ?
        )
    `).bind(`%${notice.category}%`).all();

  for (const subscriber of subscribers.results || []) {
    if (
      subscriber.whatsapp_opt_in &&
      subscriber.mobile
    ) {
      await sendWhatsAppNotice(
        subscriber,
        notice,
        env
      );

      await logDelivery(
        noticeId,
        subscriber.id,
        "whatsapp",
        "attempted",
        env
      );
    }

    if (
      subscriber.email_opt_in &&
      subscriber.email
    ) {
      /*
       * Connect Resend, MailChannels or another
       * transactional email provider here.
       */

      await logDelivery(
        noticeId,
        subscriber.id,
        "email",
        "queued",
        env
      );
    }
  }
}

async function sendWhatsAppNotice(
  subscriber,
  notice,
  env
) {
  if (
    !env.WHATSAPP_ACCESS_TOKEN ||
    !env.WHATSAPP_PHONE_NUMBER_ID
  ) {
    return;
  }

  /*
   * Use an approved WhatsApp template for proactive
   * notifications outside the customer-service window.
   */

  const endpoint =
    `https://graph.facebook.com/v23.0/` +
    `${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: normalizePhone(subscriber.mobile),
    type: "template",
    template: {
      name: "medorbit_notice_alert",
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text:
                subscriber.full_name || "Applicant"
            },
            {
              type: "text",
              text: notice.title
            },
            {
              type: "text",
              text:
                notice.closingDate ||
                "Refer to official notice"
            },
            {
              type: "text",
              text:
                notice.applicationUrl ||
                notice.sourceUrl
            }
          ]
        }
      ]
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization":
        `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    console.error(
      "WhatsApp send failed:",
      await response.text()
    );
  }
}

async function logDelivery(
  noticeId,
  subscriberId,
  channel,
  status,
  env
) {
  await env.DB.prepare(`
    INSERT INTO delivery_log (
      notice_id,
      subscriber_id,
      channel,
      status
    )
    VALUES (?, ?, ?, ?)
  `).bind(
    noticeId,
    subscriberId,
    channel,
    status
  ).run();
}

/* =========================================================
   Public notice API
   ========================================================= */

async function getPublishedNotices(request, env) {
  const url = new URL(request.url);

  const category =
    url.searchParams.get("category");

  const limit =
    Math.min(
      Math.max(
        Number(url.searchParams.get("limit")) || 20,
        1
      ),
      100
    );

  let query = `
    SELECT
      id,
      title,
      summary,
      category,
      organisation,
      location,
      source_url AS sourceUrl,
      official_pdf_url AS officialPdfUrl,
      published_date AS publishedDate,
      closing_date AS closingDate,
      eligibility,
      application_url AS applicationUrl,
      created_at AS createdAt
    FROM notices
    WHERE publication_status = 'published'
      AND (
        closing_date IS NULL
        OR closing_date = ''
        OR closing_date >= date('now')
      )
  `;

  const values = [];

  if (category) {
    query += ` AND category = ?`;
    values.push(category);
  }

  query += `
    ORDER BY featured DESC, created_at DESC
    LIMIT ?
  `;

  values.push(limit);

  const result =
    await env.DB.prepare(query)
      .bind(...values)
      .all();

  return jsonResponse({
    success: true,
    count: result.results?.length || 0,
    notices: result.results || []
  });
}

/* =========================================================
   Subscriber API
   ========================================================= */

async function subscribeUser(request, env) {
  const body = await request.json();

  const mobile =
    normalizePhone(body.mobile || "");

  if (!mobile && !body.email) {
    return jsonResponse(
      {
        success: false,
        message:
          "Mobile number or email is required."
      },
      400
    );
  }

  await env.DB.prepare(`
    INSERT INTO subscribers (
      full_name,
      mobile,
      email,
      whatsapp_opt_in,
      email_opt_in,
      preferred_categories,
      preferred_locations
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    sanitizeText(body.fullName || ""),
    mobile,
    sanitizeText(body.email || ""),
    body.whatsappOptIn ? 1 : 0,
    body.emailOptIn ? 1 : 0,
    JSON.stringify(
      body.preferredCategories || []
    ),
    JSON.stringify(
      body.preferredLocations || []
    )
  ).run();

  return jsonResponse({
    success: true,
    message:
      "Notification preferences saved."
  });
}

/* =========================================================
   Utilities
   ========================================================= */

function isAuthorized(request, env) {
  const token =
    request.headers.get("Authorization");

  return token ===
    `Bearer ${env.ADMIN_API_TOKEN}`;
}

function jsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type":
          "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
}

function safeJsonParse(value) {
  try {
    const clean =
      value
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

    return JSON.parse(clean);
  } catch {
    return null;
  }
}

function sanitizeText(value) {
  return String(value)
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 5000);
}

function stripHtml(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractXmlValue(block, tag) {
  const match =
    block.match(
      new RegExp(
        `<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`,
        "i"
      )
    );

  return match
    ? match[1]
        .replace(/<!$begin:math:display$CDATA\\\[\|$end:math:display$\]>/g, "")
        .trim()
    : "";
}

function findPdfUrl(value) {
  const match =
    value.match(
      /https?:\/\/[^\s"'<>]+\.pdf(?:\?[^\s"'<>]*)?/i
    );

  return match ? match[0] : null;
}

function normalizePhone(value) {
  const digits =
    String(value).replace(/\D/g, "");

  if (digits.length === 10) {
    return `91${digits}`;
  }

  return digits;
}

function isFutureOrUnknown(dateValue) {
  if (!dateValue) return true;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return true;
  }

  return date.getTime() >= Date.now();
}

async function sha256(value) {
  const encoded =
    new TextEncoder().encode(value);

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      encoded
    );

  return [...new Uint8Array(hash)]
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
    
    <script src="js/notices.js" defer></script>
}