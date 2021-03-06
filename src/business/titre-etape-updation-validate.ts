import { ITitreEtape, ITitreDemarche, ITitre } from '../types'

import titreEtapeTypeAndStatusValidate from './utils/titre-etape-type-and-status-validate'
import titreEtapePointsValidate from './utils/titre-etape-points-validate'
import titreEtapeDateValidate from './utils/titre-etape-date-validate'

const titreEtapeUpdationValidate = async (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  titre: ITitre
) => {
  const errors = []

  // 1. le type d'étape correspond à la démarche et au type de titre
  const error = titreEtapeTypeAndStatusValidate(
    titreEtape.typeId,
    titreEtape.statutId,
    titreDemarche.type!.etapesTypes,
    titreDemarche.type!.nom
  )
  if (error) {
    errors.push(error)
  }

  // 2. la date de l'étape est possible
  // en fonction de l'ordre des types d'étapes de la démarche
  if (titreEtape.date) {
    const error = titreEtapeDateValidate(
      titreEtape.typeId,
      titreEtape.statutId,
      titreEtape.date,
      titreDemarche.type!,
      titreDemarche.etapes!,
      titre
    )
    if (error) {
      errors.push(error)
    }
  }

  // 3. les références de points sont bien renseignées
  if (titreEtape.points) {
    const error = titreEtapePointsValidate(titreEtape.points)
    if (error) {
      errors.push(error)
    }
  }

  return errors
}

export default titreEtapeUpdationValidate
