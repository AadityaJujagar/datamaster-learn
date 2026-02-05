import { Footer } from "../components/common/Footer";
import { ContactDetails } from "../components/core/contact/ContactDetails";
import { ContactForm } from "../components/core/contact/ContactForm";

export const Contact = () => {
  return (
    <div>
      <div className="mx-auto my-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};
