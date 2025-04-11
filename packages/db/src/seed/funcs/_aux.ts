import dayjs from "dayjs"

const _today = dayjs()

export const generateUsername = (firstName: string, lastName: string) => {
  // Normalize the firstname without accents, just lowercase, and max 10 chars
  const fname = firstName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .slice(0, 10)

  // Normalize the lastname without accents, just lowercase, let the first letter untouched, but remove vogals after, like Brown = brn
  const lname =
    lastName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .slice(0, 10)
      .slice(0, -1) +
    lastName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .slice(-1)

  // randon number between 1 and 99
  const rand = Math.floor(Math.random() * 99)
    .toString()
    .padStart(2, "0")

  return `${fname}.${lname}${rand}`
}
