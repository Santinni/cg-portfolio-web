"use client";

import {
  GithubIcon,
  LinkedinIcon,
} from 'lucide-react';

import BookingModal from '@/app/(frontend)/components/ui/bookingModal';
// import { Button } from "@/app/(frontend)/components/primitives/button";
import type { Contact as ContactType } from '@/payload-types';

// import { Button } from "@/app/(frontend)/components/primitives/button";
// import { useState } from "react";
import styles from './Contact.module.css';

interface ContactProps {
  data: ContactType;
}

// TODO: Add contact form component, and add it to the contact section. Use it in modal.

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
          <div className={styles.linkWrapper}>
            <a className={styles.contactItem} href={`mailto:${data.email}`}>
              {data.email}
            </a>
            {data.phone && (
              <a className={styles.contactItem} href={`tel:${data.phone}`}>
                {data.phone}
              </a>
            )}
          </div>
          <div className={styles.linkWrapper}>
            {data.linkedin && (
              <a
                className={styles.contactItem}
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <LinkedinIcon />
              </a>
            )}
            {data.github && (
              <a
                className={styles.contactItem}
                href={data.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
              >
                <GithubIcon />
              </a>
            )}
          </div>
          <BookingModal />
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
