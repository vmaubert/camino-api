import 'dotenv/config'
import '../../src/init'
import fileCreate from '../../src/tools/file-create'

import { administrationGet } from '../../src/database/queries/administrations'

async function main() {
  // admin onf uniquement
  const userId = 'super'

  // titre echu public
  const id = 'dea-guyane-01'

  // titre non-public
  // const titreId =
  //   'm-ar-crique-grand-bagot-bistouri-et-petit-bagot-boeuf-mort-2019'

  // titre avec activités
  // const titreId = 'm-ax-auror-2018'

  const res = await administrationGet(id, {}, userId)

  console.info(res)

  await fileCreate('dev/tmp/administration.json', JSON.stringify(res, null, 2))

  process.exit(0)
}

main()