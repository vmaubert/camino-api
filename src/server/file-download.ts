import * as express from 'express'
import { join } from 'path'
import { fileNameGet } from '../api/rest/files'

// bug de typage de express-jwt
// https://github.com/auth0/express-jwt/issues/215
interface IAuthRequest extends express.Request {
  user?: {
    [id: string]: string
  }
}

const fileGet = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const userId = req.user && req.user.id
    const { titreDocumentId } = req.params
    const documentName = await fileNameGet(userId, titreDocumentId)

    const options = {
      dotfiles: 'deny',
      headers: {
        'x-sent': true,
        'x-timestamp': Date.now()
      },
      root: join(process.cwd(), 'files')
    }

    return res.sendFile(documentName, options, err => {
      if (err) {
        res.status(404).send('fichier introuvable')
      }
    })
  } catch (error) {
    return res.status(403).send(error)
  }
}

export default fileGet
