export const roles = [
  { id: 'Aluno', icon: 'AL', title: 'Aluno', description: 'Acompanhe horários, rotas e eventos do seu campus.' },
  { id: 'Servidor', icon: 'SE', title: 'Servidor', description: 'Acesse informações institucionais e rotas do campus.' },
  { id: 'Motorista', icon: 'MO', title: 'Motorista', description: 'Acesso restrito para operação do transporte institucional.' },
  { id: 'Administrador', icon: 'AD', title: 'Administrador', description: 'Gestão restrita para equipe autorizada.' },
  { id: 'Visitante', icon: 'VI', title: 'Visitante', description: 'Rotas públicas e eventos sem login acadêmico.' }
];

export const environmentTypes = [
  { id: 'if', label: 'Instituto Federal' },
  { id: 'publica', label: 'Universidade Pública' },
  { id: 'privada', label: 'Instituição Privada' },
  { id: 'outra', label: 'Outra instituição' }
];

// BRUNO: dataset SaaS demonstrativo; apenas IFCE Maracanaú libera o MVP.
export const institutions = [
  { id: 'ifce', acronym: 'IFCE', name: 'Instituto Federal do Ceará', type: 'Instituto Federal', status: 'Ambiente ativo', service: 'MinhaJardineira', logo: 'assets/assets-logo/ifce.png', fallback: 'IFCE', alt: 'Logo do IFCE', keywords: ['IFCE', 'IF', 'Instituto Federal', 'Ceará', 'Maracanaú'], campuses: [
    { id: 'maracanau', name: 'Maracanaú', status: 'MVP ativo', service: 'MinhaJardineira ativo', active: true, keywords: ['Maracanaú', 'IFCE Maracanaú', 'Campus Maracanaú'] },
    { id: 'fortaleza', name: 'Fortaleza', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Fortaleza', 'IFCE Fortaleza'] },
    { id: 'caucaia', name: 'Caucaia', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Caucaia', 'IFCE Caucaia'] },
    { id: 'sobral', name: 'Sobral', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Sobral', 'IFCE Sobral'] }
  ] },
  { id: 'ifsp', acronym: 'IFSP', name: 'Instituto Federal de São Paulo', type: 'Instituto Federal', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: '', fallback: 'IFSP', alt: 'Logo do IFSP', keywords: ['IFSP', 'IF', 'Instituto Federal', 'São Paulo'], campuses: [
    { id: 'campinas', name: 'Campinas', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Campinas', 'IFSP Campinas'] },
    { id: 'araraquara', name: 'Araraquara', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Araraquara', 'IFSP Araraquara'] },
    { id: 'braganca', name: 'Bragança Paulista', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Bragança Paulista', 'IFSP Bragança'] }
  ] },
  { id: 'ifpb', acronym: 'IFPB', name: 'Instituto Federal da Paraíba', type: 'Instituto Federal', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: '', fallback: 'IFPB', alt: 'Logo do IFPB', keywords: ['IFPB', 'IF', 'Instituto Federal', 'Paraíba'], campuses: [
    { id: 'joao-pessoa', name: 'João Pessoa', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['João Pessoa', 'IFPB João Pessoa'] },
    { id: 'campina-grande', name: 'Campina Grande', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Campina Grande', 'IFPB Campina'] },
    { id: 'cabedelo', name: 'Cabedelo', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Cabedelo', 'IFPB Cabedelo'] }
  ] },
  { id: 'ufc', acronym: 'UFC', name: 'Universidade Federal do Ceará', type: 'Universidade Pública', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: 'assets/assets-logo/ufc.png', fallback: 'UFC', alt: 'Logo da UFC', keywords: ['UFC', 'Universidade Federal', 'Universidade Pública', 'Ceará', 'Pici', 'Benfica'], campuses: [
    { id: 'pici', name: 'Pici', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Pici', 'UFC Pici', 'Campus do Pici'] },
    { id: 'benfica', name: 'Benfica', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Benfica', 'UFC Benfica'] }
  ] },
  { id: 'uece', acronym: 'UECE', name: 'Universidade Estadual do Ceará', type: 'Universidade Pública', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: 'assets/assets-logo/uece.png', fallback: 'UECE', alt: 'Logo da UECE', keywords: ['UECE', 'Universidade Estadual', 'Universidade Pública', 'Itaperi'], campuses: [
    { id: 'itaperi', name: 'Itaperi', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Itaperi', 'UECE Itaperi'] }
  ] },
  { id: 'unilab', acronym: 'UNILAB', name: 'Universidade da Integração Internacional da Lusofonia Afro-Brasileira', type: 'Universidade Pública', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: 'assets/assets-logo/unilab.png', fallback: 'UNILAB', alt: 'Logo da UNILAB', keywords: ['UNILAB', 'Universidade Pública', 'Internacional', 'Integração', 'Redenção', 'Acarape'], campuses: [
    { id: 'redencao', name: 'Redenção/Acarape', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Redenção', 'Acarape', 'UNILAB Redenção', 'UNILAB Acarape'] }
  ] },
  { id: 'fb', acronym: 'FB Uni', name: 'Centro Universitário Farias Brito', type: 'Instituição Privada', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: 'assets/assets-logo/fb.png', fallback: 'FB', alt: 'Logo da FB Uni', keywords: ['FB', 'FB Uni', 'Farias Brito', 'Centro Universitário', 'Instituição Privada', 'Particular'], campuses: [
    { id: 'fortaleza', name: 'Fortaleza', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Fortaleza', 'FB Uni Fortaleza', 'Farias Brito Fortaleza'] }
  ] }
];


// BRUNO: credenciais fictícias usadas apenas para demonstração visual.
export const demoCredentials = {
  student: [{ login: '20261045050612', password: '12345' }, { login: 'bruno.silva@aluno.ifce.edu.br', password: '12345' }],
  admin: [
    { login: '20261045050601', password: '12345' },
    { login: '20261045050602', password: '12345' },
    { login: '20261045050603', password: '12345' },
    { login: '20261045050604', password: '12345' },
    { login: 'admin.campus@ifce.edu.br', password: '12345' }
  ]
};

export const simpleTexts = {
  welcomeTitle: ['Mobilidade acadêmica simples, acessível e em tempo real.', 'Veja rotas, horários e avisos do seu campus.'],
  welcomeHelper: ['Vou te ajudar a encontrar campus, rota e horários.', 'Eu ajudo você a escolher o campus e ver informações importantes.'],
  profileTitle: ['Como você vai usar o CampusMove hoje?', 'Escolha seu tipo de acesso.'],
  roleHelper: ['Escolha seu perfil para eu mostrar as funções certas do CampusMove.', 'Escolha seu tipo de acesso.'],
  institutionHelper: ['Escolha o ambiente institucional para acessar o serviço ativo no seu campus.', 'Escolha instituição e campus para entrar.'],
  loginHelper: ['Protótipo: use uma matrícula fictícia ou e-mail acadêmico demonstrativo.', 'Use os dados de teste para entrar.'],
  homeRoute: ['IFCE Campus Maracanaú → Estação Virgílio Távora', 'IFCE Campus Maracanaú → Estação Virgílio Távora'],
  profileHelper: ['Aqui ficam as informações visuais do seu vínculo com o campus.', 'Aqui aparecem informações simples sobre seu perfil.'],
  profilePrivacy: ['Dados acadêmicos protegidos pela instituição.', 'Dados acadêmicos protegidos pela instituição.'],
  adminRestriction: ['Ambiente restrito para administradores autorizados.', 'Área só para administradores.']
};
