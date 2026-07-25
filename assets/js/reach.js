/* =========================================================
   MedOrbit Genuine Organic Reach System
   File: js/reach.js
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const shareButtons =
    document.querySelectorAll("[data-share-channel]");

  const shareMessage =
    document.getElementById("organicShareMessage");

  const subscriptionForm =
    document.getElementById("organicSubscriptionForm");

  const subscriptionMessage =
    document.getElementById(
      "organicSubscriptionMessage"
    );

  const baseUrl =
    window.location.origin +
    window.location.pathname;

  const pageTitle =
    document.title ||
    "MedOrbit Education and Career Platform";

  const shareText =
    "Explore verified admissions, private jobs, scholarships, fee updates and career guidance on MedOrbit.";

  shareButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const channel =
        button.dataset.shareChannel;

      const trackingUrl =
        createTrackingUrl(channel);

      try {
        if (channel === "whatsapp") {
          const whatsappUrl =
            "https://wa.me/?text=" +
            encodeURIComponent(
              `${shareText}\n\n${trackingUrl}`
            );

          window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
          );

          showShareSuccess(
            "WhatsApp sharing opened."
          );

          saveShareEvent(channel);

          return;
        }

        if (channel === "facebook") {
          const facebookUrl =
            "https://www.facebook.com/sharer/sharer.php?u=" +
            encodeURIComponent(trackingUrl);

          window.open(
            facebookUrl,
            "_blank",
            "noopener,noreferrer"
          );

          showShareSuccess(
            "Facebook sharing opened."
          );

          saveShareEvent(channel);

          return;
        }

        if (channel === "linkedin") {
          const linkedinUrl =
            "https://www.linkedin.com/sharing/share-offsite/?url=" +
            encodeURIComponent(trackingUrl);

          window.open(
            linkedinUrl,
            "_blank",
            "noopener,noreferrer"
          );

          showShareSuccess(
            "LinkedIn sharing opened."
          );

          saveShareEvent(channel);

          return;
        }

        if (channel === "copy") {
          await navigator.clipboard.writeText(
            trackingUrl
          );

          showShareSuccess(
            "Link copied successfully."
          );

          saveShareEvent(channel);
        }
      } catch {
        showShareError(
          "Unable to share. Please copy the website link manually."
        );
      }
    });
  });

  subscriptionForm?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      if (!subscriptionForm.checkValidity()) {
        subscriptionForm.reportValidity();
        return;
      }

      const formData =
        new FormData(subscriptionForm);

      const data = {
        fullName:
          String(formData.get("fullName") || "")
            .trim(),

        mobile:
          String(formData.get("mobile") || "")
            .replace(/\D/g, ""),

        category:
          String(formData.get("category") || ""),

        location:
          String(formData.get("location") || "")
            .trim(),

        consent:
          formData.get("consent") === "on",

        submittedAt:
          new Date().toISOString()
      };

      /*
       * Temporary browser storage.
       *
       * Replace this later with:
       * fetch("YOUR-WORKER/api/subscribe", {...})
       */

      const savedSubscriptions =
        JSON.parse(
          localStorage.getItem(
            "medorbitOrganicSubscriptions"
          ) || "[]"
        );

      const alreadyExists =
        savedSubscriptions.some(
          (subscription) =>
            subscription.mobile === data.mobile &&
            subscription.category === data.category
        );

      if (alreadyExists) {
        subscriptionMessage.textContent =
          "This number is already registered for that category.";

        subscriptionMessage.className =
          "organic-subscription-message error";

        return;
      }

      savedSubscriptions.push(data);

      localStorage.setItem(
        "medorbitOrganicSubscriptions",
        JSON.stringify(savedSubscriptions)
      );

      subscriptionMessage.textContent =
        "Your preferences have been saved. Connect this form to your Worker to activate automatic WhatsApp delivery.";

      subscriptionMessage.className =
        "organic-subscription-message success";

      subscriptionForm.reset();
    }
  );

  function createTrackingUrl(channel) {
    const url =
      new URL(baseUrl);

    url.searchParams.set(
      "utm_source",
      channel
    );

    url.searchParams.set(
      "utm_medium",
      "organic_share"
    );

    url.searchParams.set(
      "utm_campaign",
      "medorbit_community_reach"
    );

    url.searchParams.set(
      "utm_content",
      slugify(pageTitle)
    );

    return url.toString();
  }

  function saveShareEvent(channel) {
    const events =
      JSON.parse(
        localStorage.getItem(
          "medorbitShareEvents"
        ) || "[]"
      );

    events.push({
      channel,
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem(
      "medorbitShareEvents",
      JSON.stringify(events.slice(-100))
    );
  }

  function showShareSuccess(message) {
    shareMessage.textContent = message;
    shareMessage.className =
      "organic-share-message success";
  }

  function showShareError(message) {
    shareMessage.textContent = message;
    shareMessage.className =
      "organic-share-message error";
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }
<script src="js/reach.js" defer></script>
});