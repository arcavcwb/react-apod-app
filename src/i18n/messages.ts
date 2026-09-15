// Interface copy. NASA titles, captions and credits are never translated.

const es = {
  'brand.name': 'NASA APOD Explorer',
  skip: 'Saltar al contenido',
  'nav.label': 'Principal',
  'nav.today': 'Hoy',
  'nav.gallery': 'Galería',
  'nav.about': 'Acerca de',
  'lang.label': 'Idioma',

  'day.apod': 'Imagen astronómica del día',
  'day.details': 'Ver detalles',
  'day.share': 'Compartir',
  'day.hd': 'Alta resolución',
  'day.official': 'Página oficial',
  'day.month': 'Más de {month}',
  'day.prev': 'Día anterior',
  'day.next': 'Día siguiente',
  'day.random': 'Día aleatorio',
  'day.pickDate': 'Ir a una fecha',
  'day.date': 'Fecha',
  'day.credit': 'Crédito',
  'day.type': 'Tipo',
  'day.image': 'Imagen',
  'day.video': 'Video',
  'day.other': 'Contenido interactivo',
  'day.otherBody': 'Este día no es una imagen ni un video. Ábrelo en la página oficial.',
  'day.explanation': 'Explicación',
  'day.originalLanguage': 'Texto original de la NASA, en inglés.',
  'translate.auto': 'Traducción automática del texto de la NASA.',
  'translate.showOriginal': 'Ver original',
  'translate.showTranslation': 'Ver traducción',
  'translate.loading': 'Traduciendo…',
  'day.loading': 'Consultando a la NASA…',
  'day.more': 'Seguir explorando',

  'image.loading': 'Revelando la imagen…',
  'image.error': 'La imagen no cargó.',
  'image.retry': 'Reintentar',

  'error.rate-limit.title': 'La NASA pidió una pausa',
  'error.rate-limit.body': 'Se agotó el cupo de consultas por hora. Prueba de nuevo en unos minutos o abre la página oficial.',
  'error.network.title': 'Sin conexión con la NASA',
  'error.network.body': 'No pudimos llegar al servicio de APOD. Revisa tu conexión y vuelve a intentarlo.',
  'error.not-found.title': 'No hay imagen para esta fecha',
  'error.not-found.body': 'APOD no publicó ese día, o la imagen todavía no está disponible.',
  'error.contract.title': 'Respuesta inesperada',
  'error.contract.body': 'La NASA respondió con un formato que no reconocemos. La página oficial debería mostrarla.',
  'error.invalid.title': 'Esa fecha no está en el archivo',
  'error.invalid.body': 'APOD empezó el 16 de junio de 1995. Elige un día entre esa fecha y hoy.',
  'error.retry': 'Reintentar',
  'error.official': 'Abrir en apod.nasa.gov',
  'error.today': 'Ir a hoy',

  'share.copy': 'Copiar enlace',
  'share.copied': 'Enlace copiado',
  'share.text': '{title}. Imagen astronómica del día, {date}',
  'share.email': 'Correo',
  'share.menu': 'Compartir en',

  'recent.title': 'Días anteriores',
  'recent.all': 'Ver la galería',

  'gallery.title': 'Galería',
  'gallery.prev': 'Mes anterior',
  'gallery.next': 'Mes siguiente',
  'gallery.month': 'Mes',
  'gallery.year': 'Año',
  'gallery.loading': 'Cargando el mes…',
  'gallery.noPreview': 'Sin vista previa',
  'gallery.official': 'Archivo oficial',
  'gallery.nav': 'Otros meses',

  'about.title': 'Acerca de',
  'about.apodTitle': 'Qué es APOD',
  'about.apodBody':
    'Astronomy Picture of the Day publica desde el 16 de junio de 1995 una imagen o un video del universo por día, con una explicación escrita por un astrónomo profesional. La crearon Robert Nemiroff y Jerry Bonnell, y hoy es un servicio de la NASA y de Michigan Technological University.',
  'about.projectTitle': 'Este proyecto',
  'about.projectBody':
    'NASA APOD Explorer es un proyecto independiente, no afiliado a la NASA. Muestra el archivo completo con cada imagen entera, una dirección para cada día y cada mes, y una interfaz en español, inglés y portugués. Los títulos y las explicaciones aparecen tal como los publica la NASA, en inglés.',
  'about.creditsTitle': 'Créditos',
  'about.creditsBody':
    'Cada imagen pertenece a sus autores, indicados junto a ella cuando la NASA los informa. Los datos llegan de la API abierta de la NASA.',
  'about.techTitle': 'Cómo está hecho',
  'about.tech1': 'React 18, TypeScript estricto y Vite.',
  'about.tech2': 'Cada respuesta de la NASA se valida con un contrato Zod antes de mostrarse.',
  'about.tech3': 'Cada mes se pide por semanas en paralelo y queda en caché local; los días pasados no se vuelven a pedir.',
  'about.tech4': 'Las imágenes llegan redimensionadas por un CDN, en el formato más ligero que acepte el navegador.',
  'about.links': 'Enlaces',
  'about.linkApod': 'Sitio oficial de APOD',
  'about.linkApi': 'API abierta de la NASA',
  'about.linkCode': 'Código fuente en GitHub',

  'notFound.title': 'Esta página no existe',
  'notFound.body': 'La dirección no corresponde a ninguna sección.',

  'footer.disclaimer': 'Proyecto independiente, no afiliado a la NASA. Imágenes y textos: APOD y sus autores.',

  'footer.short': 'No afiliado a la NASA.',

  'pager.prev': 'Página anterior',

  'pager.next': 'Página siguiente',

  'pager.status': 'Página {page} de {pages}',

  'day.readMore': 'Leer todo',

  'day.readLess': 'Cerrar la explicación',

  'strip.prev': 'Ver días anteriores',

  'strip.next': 'Ver días siguientes',

  'action.details': 'Detalles',

  'action.hd': 'Alta res.',

  'action.official': 'Oficial',

  'action.random': 'Aleatorio',
  'footer.source': 'Código fuente',
  'title.today': 'Imagen astronómica del día',
};

export type MessageKey = keyof typeof es;
export type Messages = Record<MessageKey, string>;

const en: Messages = {
  'brand.name': 'NASA APOD Explorer',
  skip: 'Skip to content',
  'nav.label': 'Main',
  'nav.today': 'Today',
  'nav.gallery': 'Gallery',
  'nav.about': 'About',
  'lang.label': 'Language',

  'day.apod': 'Astronomy Picture of the Day',
  'day.details': 'See details',
  'day.share': 'Share',
  'day.hd': 'Full resolution',
  'day.official': 'Official page',
  'day.month': 'More from {month}',
  'day.prev': 'Previous day',
  'day.next': 'Next day',
  'day.random': 'Random day',
  'day.pickDate': 'Go to a date',
  'day.date': 'Date',
  'day.credit': 'Credit',
  'day.type': 'Type',
  'day.image': 'Image',
  'day.video': 'Video',
  'day.other': 'Interactive content',
  'day.otherBody': 'This day is neither an image nor a video. Open it on the official page.',
  'day.explanation': 'Explanation',
  'day.originalLanguage': '',
  'translate.auto': "Automatic translation of NASA's text.",
  'translate.showOriginal': 'Show original',
  'translate.showTranslation': 'Show translation',
  'translate.loading': 'Translating…',
  'day.loading': 'Asking NASA…',
  'day.more': 'Keep exploring',

  'image.loading': 'Developing the picture…',
  'image.error': 'The image did not load.',
  'image.retry': 'Try again',

  'error.rate-limit.title': 'NASA asked for a pause',
  'error.rate-limit.body': 'The hourly request quota ran out. Try again in a few minutes or open the official page.',
  'error.network.title': 'Cannot reach NASA',
  'error.network.body': 'We could not reach the APOD service. Check your connection and try again.',
  'error.not-found.title': 'No picture for this date',
  'error.not-found.body': 'APOD did not publish that day, or the picture is not available yet.',
  'error.contract.title': 'Unexpected response',
  'error.contract.body': 'NASA answered in a format we do not recognize. The official page should still show it.',
  'error.invalid.title': 'That date is not in the archive',
  'error.invalid.body': 'APOD began on 16 June 1995. Pick a day between then and today.',
  'error.retry': 'Try again',
  'error.official': 'Open on apod.nasa.gov',
  'error.today': 'Go to today',

  'share.copy': 'Copy link',
  'share.copied': 'Link copied',
  'share.text': '{title}. Astronomy Picture of the Day, {date}',
  'share.email': 'Email',
  'share.menu': 'Share on',

  'recent.title': 'Earlier days',
  'recent.all': 'Open the gallery',

  'gallery.title': 'Gallery',
  'gallery.prev': 'Previous month',
  'gallery.next': 'Next month',
  'gallery.month': 'Month',
  'gallery.year': 'Year',
  'gallery.loading': 'Loading the month…',
  'gallery.noPreview': 'No preview',
  'gallery.official': 'Official archive',
  'gallery.nav': 'Other months',

  'about.title': 'About',
  'about.apodTitle': 'What APOD is',
  'about.apodBody':
    'Since 16 June 1995, Astronomy Picture of the Day has published one image or video of the universe per day, with an explanation written by a professional astronomer. Robert Nemiroff and Jerry Bonnell created it, and today it is a service of NASA and Michigan Technological University.',
  'about.projectTitle': 'This project',
  'about.projectBody':
    'NASA APOD Explorer is an independent project, not affiliated with NASA. It shows the full archive with every picture uncropped, an address for every day and month, and an interface in Spanish, English and Portuguese. Titles and explanations appear exactly as NASA publishes them, in English.',
  'about.creditsTitle': 'Credits',
  'about.creditsBody':
    'Each picture belongs to its authors, named next to it when NASA provides them. Data comes from NASA’s open API.',
  'about.techTitle': 'How it is built',
  'about.tech1': 'React 18, strict TypeScript and Vite.',
  'about.tech2': 'Every NASA response is validated against a Zod contract before it is shown.',
  'about.tech3': 'Each month is fetched as parallel weeks and cached locally; past days are never requested twice.',
  'about.tech4': 'Images arrive resized by a CDN, in the lightest format the browser accepts.',
  'about.links': 'Links',
  'about.linkApod': 'Official APOD site',
  'about.linkApi': 'NASA open APIs',
  'about.linkCode': 'Source code on GitHub',

  'notFound.title': 'This page does not exist',
  'notFound.body': 'The address does not match any section.',

  'footer.disclaimer': 'Independent project, not affiliated with NASA. Pictures and text: APOD and their authors.',

  'footer.short': 'Not affiliated with NASA.',

  'pager.prev': 'Previous page',

  'pager.next': 'Next page',

  'pager.status': 'Page {page} of {pages}',

  'day.readMore': 'Read it all',

  'day.readLess': 'Close the explanation',

  'strip.prev': 'Show earlier days',

  'strip.next': 'Show later days',

  'action.details': 'Details',

  'action.hd': 'Full res.',

  'action.official': 'Official',

  'action.random': 'Random',
  'footer.source': 'Source code',
  'title.today': 'Astronomy Picture of the Day',
};

const ptBR: Messages = {
  'brand.name': 'NASA APOD Explorer',
  skip: 'Pular para o conteúdo',
  'nav.label': 'Principal',
  'nav.today': 'Hoje',
  'nav.gallery': 'Galeria',
  'nav.about': 'Sobre',
  'lang.label': 'Idioma',

  'day.apod': 'Imagem astronômica do dia',
  'day.details': 'Ver detalhes',
  'day.share': 'Compartilhar',
  'day.hd': 'Alta resolução',
  'day.official': 'Página oficial',
  'day.month': 'Mais de {month}',
  'day.prev': 'Dia anterior',
  'day.next': 'Próximo dia',
  'day.random': 'Dia aleatório',
  'day.pickDate': 'Ir para uma data',
  'day.date': 'Data',
  'day.credit': 'Crédito',
  'day.type': 'Tipo',
  'day.image': 'Imagem',
  'day.video': 'Vídeo',
  'day.other': 'Conteúdo interativo',
  'day.otherBody': 'Este dia não é uma imagem nem um vídeo. Abra na página oficial.',
  'day.explanation': 'Explicação',
  'day.originalLanguage': 'Texto original da NASA, em inglês.',
  'translate.auto': 'Tradução automática do texto da NASA.',
  'translate.showOriginal': 'Ver original',
  'translate.showTranslation': 'Ver tradução',
  'translate.loading': 'Traduzindo…',
  'day.loading': 'Consultando a NASA…',
  'day.more': 'Continue explorando',

  'image.loading': 'Revelando a imagem…',
  'image.error': 'A imagem não carregou.',
  'image.retry': 'Tentar de novo',

  'error.rate-limit.title': 'A NASA pediu uma pausa',
  'error.rate-limit.body': 'A cota de consultas por hora acabou. Tente de novo em alguns minutos ou abra a página oficial.',
  'error.network.title': 'Sem conexão com a NASA',
  'error.network.body': 'Não conseguimos acessar o serviço do APOD. Verifique sua conexão e tente de novo.',
  'error.not-found.title': 'Não há imagem para esta data',
  'error.not-found.body': 'O APOD não publicou nesse dia, ou a imagem ainda não está disponível.',
  'error.contract.title': 'Resposta inesperada',
  'error.contract.body': 'A NASA respondeu em um formato que não reconhecemos. A página oficial deve mostrá-la.',
  'error.invalid.title': 'Essa data não está no arquivo',
  'error.invalid.body': 'O APOD começou em 16 de junho de 1995. Escolha um dia entre essa data e hoje.',
  'error.retry': 'Tentar de novo',
  'error.official': 'Abrir em apod.nasa.gov',
  'error.today': 'Ir para hoje',

  'share.copy': 'Copiar link',
  'share.copied': 'Link copiado',
  'share.text': '{title}. Imagem astronômica do dia, {date}',
  'share.email': 'E-mail',
  'share.menu': 'Compartilhar em',

  'recent.title': 'Dias anteriores',
  'recent.all': 'Abrir a galeria',

  'gallery.title': 'Galeria',
  'gallery.prev': 'Mês anterior',
  'gallery.next': 'Próximo mês',
  'gallery.month': 'Mês',
  'gallery.year': 'Ano',
  'gallery.loading': 'Carregando o mês…',
  'gallery.noPreview': 'Sem prévia',
  'gallery.official': 'Arquivo oficial',
  'gallery.nav': 'Outros meses',

  'about.title': 'Sobre',
  'about.apodTitle': 'O que é o APOD',
  'about.apodBody':
    'Desde 16 de junho de 1995, o Astronomy Picture of the Day publica uma imagem ou um vídeo do universo por dia, com uma explicação escrita por um astrônomo profissional. Robert Nemiroff e Jerry Bonnell o criaram, e hoje ele é um serviço da NASA e da Michigan Technological University.',
  'about.projectTitle': 'Este projeto',
  'about.projectBody':
    'O NASA APOD Explorer é um projeto independente, sem vínculo com a NASA. Ele mostra o arquivo completo com cada imagem inteira, um endereço para cada dia e cada mês, e uma interface em espanhol, inglês e português. Títulos e explicações aparecem exatamente como a NASA os publica, em inglês.',
  'about.creditsTitle': 'Créditos',
  'about.creditsBody':
    'Cada imagem pertence aos seus autores, indicados ao lado dela quando a NASA os informa. Os dados vêm da API aberta da NASA.',
  'about.techTitle': 'Como foi feito',
  'about.tech1': 'React 18, TypeScript estrito e Vite.',
  'about.tech2': 'Cada resposta da NASA é validada por um contrato Zod antes de aparecer.',
  'about.tech3': 'Cada mês chega em semanas pedidas em paralelo e fica em cache local; dias passados nunca são pedidos duas vezes.',
  'about.tech4': 'As imagens chegam redimensionadas por uma CDN, no formato mais leve que o navegador aceitar.',
  'about.links': 'Links',
  'about.linkApod': 'Site oficial do APOD',
  'about.linkApi': 'APIs abertas da NASA',
  'about.linkCode': 'Código-fonte no GitHub',

  'notFound.title': 'Esta página não existe',
  'notFound.body': 'O endereço não corresponde a nenhuma seção.',

  'footer.disclaimer': 'Projeto independente, sem vínculo com a NASA. Imagens e textos: APOD e seus autores.',

  'footer.short': 'Sem vínculo com a NASA.',

  'pager.prev': 'Página anterior',

  'pager.next': 'Próxima página',

  'pager.status': 'Página {page} de {pages}',

  'day.readMore': 'Ler tudo',

  'day.readLess': 'Fechar a explicação',

  'strip.prev': 'Ver dias anteriores',

  'strip.next': 'Ver próximos dias',

  'action.details': 'Detalhes',

  'action.hd': 'Alta res.',

  'action.official': 'Oficial',

  'action.random': 'Aleatório',
  'footer.source': 'Código-fonte',
  'title.today': 'Imagem astronômica do dia',
};

export const LOCALES = ['es', 'en', 'pt-BR'] as const;
export type Locale = (typeof LOCALES)[number];

export const MESSAGES: Record<Locale, Messages> = { es, en, 'pt-BR': ptBR };

export const LOCALE_NAMES: Record<Locale, { short: string; name: string }> = {
  es: { short: 'ES', name: 'Español' },
  en: { short: 'EN', name: 'English' },
  'pt-BR': { short: 'PT', name: 'Português (Brasil)' },
};
