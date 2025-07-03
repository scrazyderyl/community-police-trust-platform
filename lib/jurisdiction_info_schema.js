import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const isMethodValueNonEmpty = (value) => value && !!(value.trim());
const isDocNonEmpty = (doc) => !!(doc?.name?.trim() || doc?.url?.trim());

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
                      .url("Enter a valid URL i.e. https://example.com/")
                  )
              case "email":
                return schema
                  .of(
                    Yup.string()
                      .trim()
                      .email("Enter a valid email address")
                  )
              case "phone":
                return schema
                  .of(
                    Yup.string()
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
                  )
            }
          })
          .test("method-values-required-validation", null, function (values) {
            const { path, parent } = this;

            // Check if any non-empty entries
            const allValues = parent.values;
            const anyNonEmpty = allValues.some(isMethodValueNonEmpty);

            const errors = [];

            // If all entries empty, only validate first entry
            if (!anyNonEmpty) {
              // Skip everything except first
              if (!values[0] || !values[0].trim()) {
                errors.push(this.createError({ path: `${path}[0]`, message: "Required" }));
              }

            }
            
            return errors.length ? new Yup.ValidationError(errors) : true;
          }),
        accepts: Yup.array().min(1, "At least one checkbox must be checked."),
        notes: Yup.string()
      }).noUnknown(true)
    ),
  documents: Yup.array()
    .of(
      Yup.object({
        name: Yup.string(),
        url: Yup.string().trim().url("Enter a valid URL i.e. https://example.com/"),
        verified: Yup.boolean(),
      })
      .noUnknown(true)
      .test("document-required-validation", null, function (document) {
        const { path, options, parent } = this;
        const index = options.index;

        // Check if any non-empty entries
        const allDocuments = parent;
        const anyNonEmpty = allDocuments.some(isDocNonEmpty);

        const errors = [];

        // If all entries empty, only validate first entry
        if (!anyNonEmpty) {
          // Skip everything except first
          if (index !== 0) {
            return true;
          }

          if (!document?.name?.trim()) {
            errors.push(this.createError({ path: `${path}.name`, message: "Required" }));
          }

          if (!document?.url?.trim()) {
            errors.push(this.createError({ path: `${path}.url`, message: "Required" }));
          }

          return errors.length ? new Yup.ValidationError(errors) : true;
        }

        // Otherwise, validate all non-empty entries

        // Skip empty entries
        if (!isDocNonEmpty(document)) {
          return true;
        }

        if (!document?.name?.trim()) {
          errors.push(this.createError({ path: `${path}.name`, message: "Required" }));
        }

        if (!document?.url?.trim()) {
          errors.push(this.createError({ path: `${path}.url`, message: "Required" }));
        }

        if (document?.verified !== true) {
          errors.push(this.createError({ path: `${path}.verified`, message: "All links must be verified." }));
        }

        return errors.length ? new Yup.ValidationError(errors) : true;
      })
    ),
}).noUnknown(true);