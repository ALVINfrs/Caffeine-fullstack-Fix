"use client"

import type React from "react"
import { useState } from "react"
import { User, Mail, Phone, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useInView } from "react-intersection-observer"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [titleRef, titleInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [descRef, descInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [mapRef, mapInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
      } else {
        throw new Error(data.error || "Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while sending your message",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact py-16 dark:bg-black light:bg-white">
      <div className="container mx-auto px-4">
        <h2
          ref={titleRef}
          className={`text-3xl md:text-4xl font-bold text-center mb-4 transition-opacity duration-500 dark:text-white light:text-amber-900 ${
            titleInView ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-amber-600 dark:text-amber-500 light:text-amber-700">&lt;Kontak </span>Kami/&gt;
        </h2>

        <p
          ref={descRef}
          className={`text-center max-w-3xl mx-auto mb-10 dark:text-gray-300 light:text-gray-700 transition-opacity duration-500 delay-200 ${
            descInView ? "opacity-100" : "opacity-0"
          }`}
        >
          Punya pertanyaan, saran, atau mau kolaborasi? Tim{" "}
          <span className="text-amber-600 dark:text-amber-500 light:text-amber-700">&lt;Caffeine/&gt;</span> siap
          bantu—entah buat urusan kopi, makanan, sampai event komunitas dev bareng React, Next.js, Laravel, Spring,
          Django, atau stack lainnya. Let's ngoding & ngopi bareng!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <iframe
            ref={mapRef}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.364969260659!2d106.87653737402864!3d-6.47537179351643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c03a40bad04b%3A0x515621e15fd25213!2sGg.%20Jempol%2C%20Kec.%20Citeureup%2C%20Kabupaten%20Bogor%2C%20Jawa%20Barat%2016810!5e0!3m2!1sid!2sid!4v1695105106593!5m2!1sid!2sid"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={`w-full h-[300px] md:h-[400px] rounded-lg shadow-lg transition-all duration-500 ${
              mapInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          ></iframe>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`space-y-4 transition-all duration-500 delay-300 ${
              formInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="input-group relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Nama"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 pl-10 dark:bg-gray-800 light:bg-white text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-500 shadow-sm"
              />
            </div>

            <div className="input-group relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 pl-10 dark:bg-gray-800 light:bg-white text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-500 shadow-sm"
              />
            </div>

            <div className="input-group relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="phone"
                placeholder="No Hp"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 pl-10 dark:bg-gray-800 light:bg-white text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-500 shadow-sm"
              />
            </div>

            <div className="input-group relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                name="message"
                placeholder="Pesan Anda"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 pl-10 dark:bg-gray-800 light:bg-white text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-500 shadow-sm min-h-[120px]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 dark:from-amber-600 dark:to-amber-500 dark:hover:from-amber-700 dark:hover:to-amber-600 rounded-md text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Mengirim...
                </span>
              ) : (
                "Kirim Pesan"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
