import { Button } from "@repo/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-svh items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Página Não Encontrada</CardTitle>
          <CardDescription>
            Oops! Parece que a página que você está tentando acessar não existe
            ou foi movida.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="font-bold text-6xl">404</p>
          <Button asChild>
            <Link href="/">Voltar para o Início</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
