import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const VALIDATION_SCHEMA = Yup.object({
  last_updated: Yup.string().nullable(),
  defer: Yup.object({
    value: Yup.string(),
    label: Yup.string(),
  }).noUnknown().nullable(),
  methods: Yup.array()
    .min(1, "At least one contact method is required.")
    .of(
      Yup.object({
        method: Yup.string().trim(),
        values: Yup.array()
          .when(['method'], ([method], schema) => {
            switch (method) {
              case "online form":
                return schema
                  .of(
                    Yup.string()
                      .trim()
                      .required("Required")
                      .url("Enter a valid URL i.e. https://example.com/")
                  )
              case "email":
                return schema
                  .of(
                    Yup.string()
                      .trim()
                      .required("Required")
                      .email("Enter a valid email address")
                  )
              case "phone":
                return schema
                  .of(
                    Yup.string()
                      .required("Required")
                      .test(
                        "is-valid-phone",
                        "Enter a valid phone number.",
                        (value) => {
                          if (!value) {
                            return false;
                          }

                          const phone = parsePhoneNumberFromString("+" + value);

                          return phone ? phone.isValid() : false;
                        }
                      )
                  )
              default:
                // Handles all other methods, including mail, in-person, and other
                return schema
                  .of(
                    Yup.string()
                      .trim()
                      .required("Required")
                  )
            }
          }),
        accepts: Yup.array().min(1, "At least one checkbox must be checked."),
        notes: Yup.string()
      }).noUnknown(true)
    ),
  documents: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().trim().required("Required"),
        url: Yup.string().trim().required("Required"),
        verified: Yup.boolean().oneOf([true], "All links must be verified."),
      }).noUnknown(true)
    ),
}).noUnknown(true);