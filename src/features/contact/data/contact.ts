export const contactContent = {
  title: 'Fala aí!',
  note: 'Software engineer em São Paulo. Respondo assim que o deploy deixar!',
  formLead: 'Preencha o formulário ou me manda um e-mail em',
  email: 'victordasilvafernandes@gmail.com',
  submitLabel: 'Enviar!',
  successMessage: 'Tudo certo! Vamos conversar!',
  fields: {
    name: 'Seu nome ou empresa',
    email: 'E-mail',
    message: 'Mensagem',
  },
  image: {
    src: 'https://placehold.co/900x1100/111/fff?text=OI',
    alt: 'Ilustração da página de contato',
    overlay: 'Fala aí!',
  },
  location: {
    label: 'Local atual',
    value: 'São Paulo,\nBrasil',
  },
  phone: {
    label: 'Telefone',
    value: '+55 11 96911-5001',
    href: 'tel:+5511969115001',
  },
} as const
