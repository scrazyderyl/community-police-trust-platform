import { Formik, Form, Field } from "formik";

export default function FeedbackOverlay({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Formik
        initialValues={{ accountability: "", tool: "", followup: "" }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const submitData = async () => {
            const res = await fetch(`/api/submit_feedback`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });

            // Submission error
            if (!res.ok) {
              alert("Submission failed. Please try again later.");
              setSubmitting(false);
              return;
            }

            // Submission success
            resetForm();
            setSubmitting(false);
            onClose();
            alert("Thank you for your feedback!");
          }

          submitData();
        }}
      >
        {({ isSubmitting }) => (
          <div className="bg-white rounded-xl shadow-lg p-8 w-[600px] relative">
            <button
              className="absolute top-3 right-6 text-gray-400 hover:text-gray-700 text-4xl cursor-pointer"
              onClick={onClose}
            >
              ×
            </button>
            <Form>
              <h2 className="text-2xl font-bold mb-2 text-center">Thank you for your contribution!</h2>
              <p className="mb-6 text-center text-gray-700">
                If you have the time, we welcome your feedback.
              </p>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="accountability">
                  What are your thoughts about law enforcement accountability? What do you see as barriers?
                </label>
                <Field
                  as="textarea"
                  name="accountability"
                  className="w-full border rounded px-3 py-2 resize-none"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="tool">
                  What are your thoughts on this tool?
                </label>
                <Field
                  as="textarea"
                  name="tool"
                  className="w-full border rounded px-3 py-2 resize-none"
                  rows={4}
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium mb-1" htmlFor="followup">
                  Would you be open to a short follow-up interview? If so, please share your contact details (phone or email) where we can reach you.
                </label>
                <Field
                  as="textarea"
                  name="followup"
                  className="w-full border rounded px-3 py-2 resize-none"
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                disabled={isSubmitting}
              >
                Submit Feedback
              </button>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}
