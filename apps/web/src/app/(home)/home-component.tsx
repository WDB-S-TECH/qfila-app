"use client"

import { Button } from "@repo/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card"
import { motion } from "framer-motion"
import Link from "next/link"

const MotionCard = motion(Card)

export function HomeComponent() {
  return (
    <div className="container flex min-h-screen items-center justify-center bg-gray-100">
      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md p-4"
      >
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-2xl">
            Bem-vindo ao QFila
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 text-sm">
            Sistema de fila de espera
          </p>
        </CardContent>
        <div className="mt-4 flex justify-center">
          <Button asChild>
            <Link href="/painel">Entrar</Link>
          </Button>
        </div>
      </MotionCard>
    </div>
  )
}
