import fetch from 'node-fetch'

interface IMatomoSectionData {
  label: string
  subtable?: {
    label: string
    nb_events: number
  }[]
  nb_events?: number
}

const matomoData = async () => {
  // calcul du mois de départ
  const statsNbrMonth = parseInt(process.env.STATS_NBR_MONTH!) - 1

  const date = new Date()
  date.setMonth(date.getMonth() - statsNbrMonth)
  date.setDate(1)
  const startDate = date.toISOString().slice(0, 10)

  // Datas de la page 'Récapitulatif' des visites dans matomo
  // url
  const pathVisit = `${process.env
    .API_MATOMO_URL!}?date=${startDate},today&expanded=1&filter_limit=-1&format=JSON&format_metrics=1&idSite=${process
    .env
    .API_MATOMO_ID!}&method=API.get&module=API&period=month&token_auth=${process
    .env.API_MATOMO_TOKEN!}`

  // Matomo retourne un objet dont
  // les clés sont les mois,
  // les valeurs sont des objets dont les clés utiles aux stats sont
  // nb_searches : nombre de recherches (int)
  // nb_actions_per_visit : nombre moyen d'actions (int)
  // avg_time_on_site : temps de session moyen (string)
  // nb_downloads : nombre de téléchargements
  const response = await fetch(pathVisit)
  const matomoVisitData: {
    [month: string]: {
      // eslint-disable-next-line camelcase
      nb_searches: number
      // eslint-disable-next-line camelcase
      nb_actions_per_visit: number
      // eslint-disable-next-line camelcase
      avg_time_on_site: string
      // eslint-disable-next-line camelcase
      nb_downloads: number
    }
  } = await response.json()

  // tableau des mois
  const months = Object.keys(matomoVisitData)
  // mois courant
  const currentMonth = months[months.length - 1]
  // données du mois courant
  const currentData = matomoVisitData[currentMonth]
  // objet mois:nbr de recherches

  const nbSearchArray = Object.keys(matomoVisitData).map(key => {
    return {
      month: key,
      value: (matomoVisitData[key].nb_searches || 0).toString()
    }
  })

  // nombre d'action du mois courant
  const nbAction = currentData.nb_actions_per_visit.toString()
  // temps de session du mois courant
  const timeSession = formatTime(currentData.avg_time_on_site)
  // nombre de téléchargements du mois courant
  const nbDonwload = currentData.nb_downloads.toString()

  // nombre d'erreurs signalées

  // calcul de la liste des dates (la requête s'effectue année par année, depuis la mise en place de Matomo cad 2020)
  const dateYearArray = getDateYearArray()
  const eventErreurActionRegex = /(?=.*signaler)(?=.*erreur)/g

  const nbErreur = (
    await getNbEventArray(
      getPath('Events.getAction', 'year', { flat: 1 }),
      dateYearArray,
      data =>
        data.value.reduce(
          (
            acc: number,
            act: {
              label: string
              nb_events: number
            }
          ) => {
            if (act.label.match(eventErreurActionRegex)) {
              acc += act.nb_events
            }

            return acc
          },
          0
        )
    )
  ).reduce((acc: number, nbErreur) => (acc += nbErreur.value), 150)

  // nombre de réutilisations
  const actionTitresFluxGeojson = 'titres-flux-geojson'

  const nbReutilisation = (
    await getNbEventArray(
      getPath('Live.getLastVisitsDetails', 'month'),
      dateYearArray,
      data =>
        data.value
          .map((e: { actionDetails: any }) => e.actionDetails)
          .filter(
            (ad: { title: string }) => ad.title === actionTitresFluxGeojson
          )
    )
  ).reduce((acc: number, nbReutilisation) => (acc += nbReutilisation.value), 6)

  // Datas des évènements, catégorie 'titres-sections', actions:
  // titre-editer
  // titre-demarche_ajouter
  // titre-demarche_editer
  // titre-demarche_supprimer
  // titre-etape_ajouter
  // titre-etape_editer
  // titre-etape_supprimer
  // titre-etape-doc_ajouter
  // jusqu'au 01/10/2020
  // et
  // titre-xxx-enregistrer
  // à partir du 01/10/2020
  const tDate = new Date()
  tDate.setMonth(9)
  tDate.setDate(1)
  const toggleDate = tDate.toISOString().slice(0, 10)

  const eventActionsArray = [
    'titre-editer',
    'titre-demarche_ajouter',
    'titre-demarche_editer',
    'titre-demarche_supprimer',
    'titre-etape_ajouter',
    'titre-etape_editer',
    'titre-etape_supprimer',
    'titre-etape-doc_ajouter'
  ]

  const eventActionRegex = /titre-[a-z-]*enregistrer/g

  // calcul de la liste des dates (la requête s'effectue mois par mois)
  const dateArray = getDateArray(statsNbrMonth)

  // retourne un tableau de nombre de maj des titres en fonction de mois(dateArray),
  // de eventActions qui est un tableau de noms d'action d'évènements Matomo
  // de eventActionRegex une regex que les noms d'action d'évènements Matomo doivent vérifier (titre-xxx-enregistrer),
  // et de toggleDate, la date de prise en compte de ces nouvelles actions (plus fiable)
  const nbMajTitresArray = await getNbEventArray(
    getPath('Events.getCategory', 'month'),
    dateArray,
    data =>
      data.value
        .find((cat: { label: string }) => cat.label === 'titre-sections')!
        .subtable!.reduce(
          (
            acc: number,
            eventAction: {
              label: string
              nb_events: number
            }
          ) => {
            if (Date.parse(data.month) < Date.parse(toggleDate)) {
              if (eventActionsArray.includes(eventAction.label)) {
                acc += eventAction.nb_events
              }
            } else if (eventAction.label.match(eventActionRegex)) {
              acc += eventAction.nb_events
            }

            return acc
          },
          0
        )
  )

  return {
    nbSearchArray,
    nbMajTitresArray,
    nbAction,
    timeSession,
    nbDonwload,
    nbErreur,
    nbReutilisation
  }
}

const formatTime = (time: string) => {
  // si le temps ne présente que des secondes, l'afficher ainsi
  // sinon, ne garder que les minutes
  const index = time.search('min')

  return index === -1 ? time : time.substring(0, index + 3).replace(' ', '')
}

const getDateYearArray = () => {
  const dateYearArray = []

  // année de départ : 2020
  const startYear = 2020

  // nombre d'année entre 2019 et l'année courante
  const curdate = new Date()
  const nbAnnee = curdate.getFullYear() - startYear

  for (let i = nbAnnee; i >= 0; i--) {
    const date = new Date()
    date.setFullYear(curdate.getFullYear() - i)
    dateYearArray[nbAnnee - i] = date.toISOString().slice(0, 10)
  }

  return dateYearArray
}

const getDateArray = (nbrMonth: number) => {
  const dateArray = []

  for (let i = 0; i <= nbrMonth; i++) {
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - i)
    startDate.setDate(1)
    dateArray[nbrMonth - i] = startDate.toISOString().slice(0, 10)
  }

  return dateArray
}

const getPath = (
  method: string,
  period: string,
  params?: { [param: string]: string | number }
) => {
  const _params = params
    ? Object.entries(params).reduce(
        (acc, param) => (acc = `${acc}&${param[0]}=${param[1]}`),
        ''
      )
    : ''

  return `${process.env.API_MATOMO_URL}?expanded=1${_params}&filter_limit=-1&format=JSON&idSite=${process.env.API_MATOMO_ID}&method=${method}&module=API&period=${period}&token_auth=${process.env.API_MATOMO_TOKEN}`
}

const getNbEventArray = async (
  path: string,
  dateArray: string[],
  matomoResultToNbEvent: (arg: any) => number
) =>
  (
    await Promise.all(
      dateArray.map(async date => {
        const matomoSectionData: IMatomoSectionData[] = await (
          await fetch(`${path}&date=${date}`)
        ).json()

        return {
          month: date,
          value: matomoSectionData
        }
      })
    )
  ).map(data => {
    const month = data.month.slice(0, 7)
    if (!data.value || !data.value.length) {
      return { month: month, value: 0 }
    }
    const nbEvent = matomoResultToNbEvent(data)

    return { month: month, value: nbEvent }
  })

export { matomoData }
