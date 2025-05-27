import { useState } from "react";

// Components
import CustomAccordion from "../../Components/Accordion";

const FAQ = () => {
  const [expandedPanel, setExpandedPanel] = useState(null);

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : null);
  };

  const faqs = [
    {
      category: "General Questions",
      questions: [
        {
          title: "What is this platform about?",
          content:
            "This platform connects Nepali candidates with employers abroad in countries like Qatar, Dubai, Saudi Arabia, Australia, and Europe. It provides a secure, transparent, and user-friendly experience for job seekers and job creators.",
        },
        {
          title: "Who can use this platform?",
          content:
            "Our platform is designed for three types of users:\n\n1. Candidates looking for jobs.\n2. Creators (employers) seeking workers.\n3. Admins managing the platform for security and quality control.",
        },
        {
          title: "How do I sign up?",
          content:
            "Click the 'Sign Up' button on the homepage. You’ll need to provide your email address and other necessary details.",
        },
        {
          title: "Is there a fee to use this platform?",
          content:
            "No, it’s free for Candidates to search and apply for jobs. Creators may have premium options in the future, but basic features are free.",
        },
      ],
    },
    {
      category: "Candidate-Specific Questions",
      questions: [
        {
          title: "How can I find jobs?",
          content:
            "Use the search bar or filters to find jobs based on location, category, or salary range.",
        },
        {
          title: "Can I apply for a job without logging in?",
          content:
            "No, you need to log in to apply for a job or view detailed job information like recruiter contact details.",
        },
        {
          title: "What happens after I apply for a job?",
          content:
            "You can track your application status in your dashboard. You will be notified when the Creator updates your application status (e.g., accepted, rejected, or hired).",
        },
        {
          title: "How do I know if a job is genuine?",
          content:
            "All job postings are reviewed and approved by our Admin team to ensure authenticity. If you suspect a job to be fake, report it immediately using the 'Report' button on the job page.",
        },
        {
          title: "Can I save jobs I’m interested in?",
          content:
            "Yes, you can bookmark jobs to view or apply for them later.",
        },
        {
          title: "How will I receive updates about jobs?",
          content:
            "You’ll receive notifications via email, on your dashboard, and through browser push notifications if enabled.",
        },
      ],
    },
    {
      category: "Creator-Specific Questions",
      questions: [
        {
          title: "How can I post a job?",
          content:
            "Log in to your Creator account and click on 'Post a Job.' Fill in all required fields, such as job title, location, salary range, and contact details.",
        },
        {
          title: "Do I need Admin approval for my job postings?",
          content:
            "Yes, all job postings need Admin approval to ensure authenticity and compliance. You will be notified once your job is approved.",
        },
        {
          title: "Can I edit or delete my job postings?",
          content:
            "Yes, you can edit or delete your job postings from your dashboard. However, any edits will require re-approval from the Admin team.",
        },
        {
          title: "How do I manage candidate applications?",
          content:
            "You can view all candidate applications on your dashboard, mark candidates as hired, and communicate with them directly through the chat system.",
        },
        {
          title: "What happens if my job is marked as 'Seized'?",
          content:
            "If a job is seized, it means the Admin has found issues with your posting. You can contact Admin via chat to resolve the matter.",
        },
      ],
    },
    {
      category: "Admin-Specific Questions",
      questions: [
        {
          title: "What are the responsibilities of the Admin?",
          content:
            "Admins ensure platform security and quality by:\n\n1. Approving or rejecting job postings.\n2. Handling user complaints.\n3. Seizing suspicious job listings.\n4. Managing platform analytics and performance.",
        },
        {
          title: "Can Admins view user data?",
          content:
            "Yes, Admins can access user data to monitor activities and ensure compliance with platform rules.",
        },
        {
          title: "How does the Admin handle complaints?",
          content:
            "Admins investigate complaints and take necessary actions, such as seizing job postings or suspending accounts.",
        },
      ],
    },
    {
      category: "Notifications and Alerts",
      questions: [
        {
          title: "How do I enable notifications?",
          content:
            "Browser notifications can be enabled during your first visit or in your browser settings.",
        },
        {
          title: "What types of notifications will I receive?",
          content:
            "Candidates: Updates on job application status, new job alerts, and approaching deadlines.\n\nCreators: Notifications for job approvals, approaching deadlines, and filled worker slots.",
        },
      ],
    },
    {
      category: "Security and Compliance",
      questions: [
        {
          title: "Is my data secure?",
          content:
            "Yes, your data is encrypted and stored securely in compliance with privacy regulations.",
        },
        {
          title: "How can I report a suspicious job?",
          content:
            "Use the 'Report' button on the job page, or contact Admin via chat to report suspicious activity.",
        },
        {
          title: "What should I do if I forget my password?",
          content:
            "Click on 'Forgot Password' on the login page. You’ll receive an email with instructions to reset your password.",
        },
      ],
    },
    {
      category: "Monetization & Donations",
      questions: [
        {
          title: "How is this platform monetized?",
          content:
            "The platform generates revenue through:\n\n1. Google Ads.\n2. Affiliate banners for services like resume building.\n3. Voluntary donations from users.",
        },
        {
          title: "How can I make a donation?",
          content:
            "You can donate via Stripe, Visa, Mastercard, or GooglePay. Donations support platform maintenance and improvements.",
        },
      ],
    },
    {
      category: "Support and Assistance",
      questions: [
        {
          title: "How can I contact support?",
          content:
            "You can contact our Admin team directly via the real-time chat system available on the platform.",
        },
        {
          title: "Where can I provide feedback?",
          content:
            "We value your feedback! Use the 'Feedback' option in your dashboard or email us directly at [support email].",
        },
        {
          title: "What languages does this platform support?",
          content:
            "Currently, the platform is available in English. Support for other languages, including Nepali, is planned for future updates.",
        },
      ],
    },
  ];

  return (
    <>
      <h1 className="mobilesm:text-xl mobile:text-2xl text-neutral font-medium text-center my-4">
        Frequently Asked Questions
      </h1>

      <section className="flex flex-col gap-y-4">
        {faqs.map((category, index) => (
          <div key={index} className="flex flex-col gap-y-2">
            <h2 className="text-lg text-neutral font-medium">
              {index + 1}. {category.category}
            </h2>

            {category.questions.map((faq, idx) => (
              <CustomAccordion
                key={idx}
                data={faq}
                expanded={expandedPanel === `${index}-${idx}`}
                onChange={handleAccordionChange(`${index}-${idx}`)}
              />
            ))}
          </div>
        ))}
      </section>
    </>
  );
};

export default FAQ;
