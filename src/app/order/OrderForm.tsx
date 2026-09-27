"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Wordmark } from "@/components/ui/Icons";
import styles from "./order.module.css";

const ProductPreview = dynamic(() => import("./ProductPreview"), { ssr: false });

export function OrderForm() {
  const [quantity, setQuantity] = useState(1);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const shipping = Math.ceil(quantity / 10) * 50;

  return <main className={styles.page}>
    <header className={styles.nav}>
      <a href="/" className={styles.brand}><Wordmark className="h-7 w-7" /> CONSCIOUS CHOICE</a>
      <a href="/">← BACK TO WEBSITE</a>
    </header>
    <div className={styles.heading}>
      <h1>YOUR DAILY KICK-START.</h1>
      <p>Freshly made in Bangkok. Ready for your doorstep.</p>
    </div>
    <p className={styles.notice}>Order page preview — checkout is not open yet. Please do not transfer money. Details entered here are not sent or saved.</p>
    <form className={styles.grid} onSubmit={(event) => event.preventDefault()}>
      <section className={styles.product} aria-labelledby="product-heading">
        <p className={styles.eyebrow}>YOUR PRODUCT</p>
        <div className={styles.bottle} role="img" aria-label="Conscious Choice Original Kick-Start orange juice bottle"><ProductPreview /></div>
        <h2 id="product-heading">ORIGINAL KICK-START</h2>
        <p className={styles.volume}>300 ML</p>
        <div className={styles.quantity}>
          <label htmlFor="quantity">QUANTITY</label>
          <div className={styles.stepper}>
            <button type="button" aria-label="Remove one bottle" disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)}>−</button>
            <input id="quantity" name="quantity" type="number" min="1" max="100" value={quantity} onChange={(e) => setQuantity(Math.min(100, Math.max(1, Math.trunc(Number(e.target.value) || 1))))} />
            <button type="button" aria-label="Add one bottle" disabled={quantity >= 100} onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>
        <div className={styles.shipping} aria-live="polite"><span>Bangkok delivery</span><strong>฿{shipping}</strong></div>
        <p className={styles.fine}>฿50 per group of up to 10 bottles.</p>
      </section>

      <section className={styles.details} aria-labelledby="details-heading">
        <h2 id="details-heading"><span>01 /</span> YOUR DETAILS</h2>
        <p>Tell us where to deliver your goodness.</p>
        <div className={styles.fields}>
          <label>FULL NAME<input name="fullName" autoComplete="name" required maxLength={100} placeholder="Enter your full name" /></label>
          <label>PHONE NUMBER<input name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="Enter your phone number" /></label>
          <label>EMAIL<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Enter your email" /></label>
          <label>DELIVERY ADDRESS<textarea name="address" autoComplete="street-address" required maxLength={500} rows={3} placeholder="House number, building, road, etc." /></label>
          <div className={styles.pair}>
            <label>DISTRICT<input name="district" autoComplete="address-level3" required maxLength={100} placeholder="Bangkok district" /></label>
            <label>POSTCODE<input name="postcode" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}" required maxLength={5} placeholder="5-digit postcode" /></label>
          </div>
          <label>DELIVERY NOTES (OPTIONAL)<textarea name="notes" maxLength={500} rows={3} placeholder="e.g. Leave at front desk, best time to call…" /></label>
        </div>
      </section>

      <section className={styles.payment} aria-labelledby="payment-heading">
        <h2 id="payment-heading"><span>02 /</span> PAYMENT</h2>
        <p>Thai bank QR transfer.</p>
        <p className={styles.eyebrow}>THAI BANK QR TRANSFER</p>
        <a className={styles.qr} href="/promptpay-qr.jpg" target="_blank" rel="noopener noreferrer" aria-label="Open original PromptPay QR image">
          <span className={styles.qrCrop}>
            <Image src="/promptpay-qr.jpg" alt="PromptPay transfer QR for MR. VEERAPHAN CHAYANGKURA NA AYUDHYA" width={895} height={1827} unoptimized className={styles.qrImage} />
          </span>
        </a>
        <p className={styles.fine}>Preview only — please do not transfer yet.</p>
        <a className={styles.save} href="/promptpay-qr.jpg" download="Conscious-Choice-PromptPay.jpg">↓ Save QR</a>
        <div className={styles.upload}>
          <label htmlFor="slip" className={styles.eyebrow}>UPLOAD TRANSFER SLIP</label>
          <label className={styles.drop} htmlFor="slip"><span>↑</span><strong>{fileName || "Choose a transfer slip"}</strong><small>JPG, PNG or PDF · Max 10 MB · Preview only</small>
            <input id="slip" type="file" accept="image/jpeg,image/png,application/pdf" aria-describedby="slip-error" onChange={(event) => {
              const file = event.target.files?.[0];
              setFileError(""); setFileName("");
              if (!file) return;
              if (file.size > 10 * 1024 * 1024 || !["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
                setFileError("Choose a JPG, PNG or PDF smaller than 10 MB."); event.target.value = ""; return;
              }
              setFileName(file.name);
            }} />
          </label>
          <p id="slip-error" role="alert" className={styles.error}>{fileError}</p>
        </div>
        <button className={styles.submit} type="submit" disabled>SUBMIT ORDER →</button>
        <p className={styles.fine}>Not available yet. Orders will require manual approval after payment review.</p>
      </section>
    </form>
    <footer className={styles.footer}>NOURISH YOUR BODY. HONOR THE EARTH.<span>BANGKOK, THAILAND</span></footer>
  </main>;
}
