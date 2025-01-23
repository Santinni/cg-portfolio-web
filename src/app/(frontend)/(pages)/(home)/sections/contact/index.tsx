"use client";

import { Button } from "@/app/(frontend)/components/primitives/button";
// import { useState } from "react";
import styles from "./Contact.module.css";
// import { Button } from "@/app/(frontend)/components/primitives/button";
import type { Contact as ContactType } from "@/payload-types";

interface ContactProps {
  data: ContactType;
}

export default function Contact({ data }: ContactProps) {
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   message: "",
  // });

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // Here you would typically send the form data to your backend
  //   console.log("Form submitted:", formData);
  //   // Reset form after submission
  //   setFormData({ name: "", email: "", message: "" });
  // };

  return (
    <section className={styles.section} id="contact">
      <div className={styles.container}>
        <h2 className={styles.title}>{data.title}</h2>
        <p className={styles.subtitle}>{data.description}</p>
        <div className={styles.content}>
          <a href={`mailto:${data.email}`}>{data.email}</a>
          {data.phone && <a href={`tel:${data.phone}`}>{data.phone}</a>}
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer">
              {data.linkedin}
            </a>
          )}
          {data.github && (
            <a href={data.github} target="_blank" rel="noopener noreferrer">
              {data.github}
            </a>
          )}
          <Button>Book a meeting</Button>
          {/* <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="message" className={styles.label}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className={styles.textarea}
              ></textarea>
            </div>
            <Button type="submit">Send Message</Button>
          </form> */}
        </div>
      </div>
    </section>
  );
}
