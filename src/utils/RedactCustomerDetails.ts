import { set, has, cloneDeep } from 'lodash'

const TO_REDACT: string[] = ['email', 'password', 'methodArn', 'name']

/**
 * Redacts sensitive customer information.
 *
 * @example
 * redactCustomerDetails({client: {name: 'mr client}});
 * // returns {client: {name: '<REDACTED>'}}
 *
 * @param {data} data that needs to be redacted
 *
 * @returns {object} redacted object
 */
export function redactCustomerDetails(
  data: object | Array<object>,
  OPTIONAL_REDACT: string[] = []
): object {
  const redactedData: object | Array<object> = cloneDeep(data)

  const redact = [...TO_REDACT, ...OPTIONAL_REDACT]

  //  redact array @TODO
  // const isArray = Array.isArray(redactedData)

  redact.forEach((field) => {
    if (has(redactedData, field)) {
      set(redactedData, field, '<REDACTED>')
    }
  })

  return redactedData
}
