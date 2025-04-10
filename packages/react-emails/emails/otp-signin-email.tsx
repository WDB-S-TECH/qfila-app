import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text
} from "@react-email/components"

const styles = {
  body: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: "32px 0",
    fontFamily: "sans-serif"
  } as const,
  container: {
    margin: "0 auto",
    width: "100%",
    maxWidth: "465px"
  } as const,
  wrapper: {
    borderRadius: "12px",
    backgroundColor: "#f9fafb",
    padding: "32px",
    boxShadow: "none"
  } as const,
  title: {
    margin: 0,
    textAlign: "center" as const,
    fontSize: "24px",
    fontWeight: 500,
    color: "#374151"
  } as const,
  greeting: {
    margin: 0,
    textAlign: "center" as const,
    fontSize: "16px",
    color: "#374151"
  } as const,
  message: {
    marginTop: "12px",
    marginBottom: "4px",
    textAlign: "center" as const,
    fontSize: "16px",
    color: "#374151"
  } as const,
  identifier: {
    margin: 0,
    textAlign: "center" as const,
    fontWeight: "bold",
    fontSize: "16px",
    color: "#374151"
  } as const,
  codeWrapper: {
    margin: "24px 0",
    textAlign: "center"
  } as const,
  codeContainer: {
    display: "inline-block",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "16px 32px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  } as const,
  code: {
    margin: 0,
    fontWeight: "bold",
    fontSize: "30px",
    color: "#111827",
    letterSpacing: "0.05em"
  } as const,
  disclaimer: {
    marginTop: "24px",
    textAlign: "center" as const,
    color: "#374151",
    fontSize: "14px"
  } as const,
  footer: {
    marginTop: "24px",
    textAlign: "center" as const,
    color: "#6b7280",
    fontSize: "14px"
  } as const
}

interface OTPSignInEmailProps {
  validationCode?: string
  identifier?: string
}

export const OTPSignInEmail = ({
  validationCode = "0000",
  identifier = "usuario@exemplo.com"
}: OTPSignInEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Seu código de acesso AGJ-CLINIC</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <div style={styles.wrapper}>
            <Section>
              <Text style={styles.title}>AGJ-CLINIC</Text>
            </Section>
            <Section>
              <Text style={styles.greeting}>Olá,</Text>
              <Text style={styles.message}>
                Foi solicitado um código de acesso para:
              </Text>
              <Text style={styles.identifier}>{identifier}</Text>
              <Text style={styles.message}>Seu código de acesso é:</Text>
              <div style={styles.codeWrapper}>
                <div style={styles.codeContainer}>
                  <Text style={styles.code}>{validationCode}</Text>
                </div>
              </div>
              <Text style={styles.disclaimer}>
                Este código expira em 10 minutos. Se você não solicitou este
                código, por favor ignore este email.
              </Text>
              <Text style={styles.footer}>
                Atenciosamente,
                <br />
                Equipe AGJ-CLINIC
              </Text>
            </Section>
          </div>
        </Container>
      </Body>
    </Html>
  )
}

export default OTPSignInEmail
