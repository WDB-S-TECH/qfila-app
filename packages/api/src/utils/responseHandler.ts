// src/utils/responseHandler.ts
// Padronizando as Respostas da API

import type { NextApiResponse } from "next"

const responseHandler = (
  res: NextApiResponse,
  status: number,
  message: string,
  // biome-ignore lint/suspicious/noExplicitAny: correct
  data: any = null
) => {
  return res.status(status).json({
    status,
    message,
    data
  })
}

export default responseHandler
