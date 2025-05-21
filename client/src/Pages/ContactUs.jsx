import { useEffect, useState } from "react";

// Store
import { useAuthStore } from "../Store/useAuthStore";
import { useContactStore } from "../Store/useContactStore";

// Components
import { FloatingLabelInput } from "../Components/Input";
import { SelectSimple, TextAreaFloatingLabel } from "../Components/Input";
import { LoadingCircle } from "../Components/Loading";
import { AlertBox } from "../Components/AlertBox";

const ContactUs = () => {
  const { sendEmailToAdmin } = useContactStore();
  const { user } = useAuthStore();

  const initialMailData = {
    name: "",
    email: user?.email ?? "",
    subject: "",
    otherSubject: "",
    message: "",
  };

  const [mailData, setMailData] = useState(initialMailData);
  const [sendingMail, setSendingMail] = useState(false);

  const subjectOptions = [
    { label: "Issue Signing In", value: "issue-signing-in" },
    { label: "Reporting Bugs or Technical Issues", value: "reporting-bugs" },
    { label: "Feedback on Platform Features", value: "feedback" },
    { label: "Sharing Success Stories", value: "success-stories" },
    { label: "Others", value: "others" },
  ];

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setMailData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handleSubjectSelect = (selectedSubject) => {
    setMailData((pre) => ({
      ...pre,
      subject: selectedSubject.label,
      otherSubject: selectedSubject === "Others" ? pre.otherSubject : "",
    }));
  };

  const handleSendEmail = async () => {
    if (
      !mailData.name ||
      !mailData.email ||
      !mailData.subject ||
      !mailData.message
    ) {
      AlertBox({ title: "All field are required!", icon: "error" });

      return;
    }

    setSendingMail(true);

    try {
      let res = await sendEmailToAdmin(mailData);

      AlertBox({ title: res.message, icon: "success" });

      setMailData(initialMailData);
    } catch (error) {
      AlertBox({ title: error.message, icon: "error" });
    } finally {
      setSendingMail(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      setMailData((pre) => ({
        ...pre,
        email: user?.email,
      }));
    }
  }, [user?.email]);

  return (
    <>
      <section className="w-11/12 mt-5 mx-auto">
        <h2 className="text-2xl text-neutral font-medium text-center mb-4">
          Contact Us
        </h2>

        <div className="w-full flex flex-col gap-y-2">
          <FloatingLabelInput
            label="Name"
            name="name"
            id="name"
            value={mailData.name}
            handleInputChange={handleInputChange}
          />

          <FloatingLabelInput
            label="Email"
            name="email"
            id="email"
            readOnly={user?.email}
            value={mailData.email}
            handleInputChange={handleInputChange}
          />

          <SelectSimple
            name="subject"
            placeholder="Subject"
            options={subjectOptions}
            value={mailData.subject}
            handleSelect={handleSubjectSelect}
          />

          {mailData.subject === "Others" && (
            <FloatingLabelInput
              label="Other Subject"
              name="otherSubject"
              id="otherSubject"
              value={mailData?.otherSubject}
              handleInputChange={handleInputChange}
            />
          )}

          <TextAreaFloatingLabel
            label="message"
            name="message"
            id="message"
            value={mailData.message}
            handleInputChange={handleInputChange}
            className="min-h-32"
          />

          <button
            disabled={sendingMail}
            onClick={handleSendEmail}
            className="text-neutral text-lg bg-main rounded-md py-2 disabled:bg-gray"
          >
            {sendingMail ? <LoadingCircle size={28} /> : "Send"}
          </button>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
