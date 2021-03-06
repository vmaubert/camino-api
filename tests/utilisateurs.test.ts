import 'dotenv/config'

import { knex, dbManager, app } from './init'
import { graphQLCall, queryImport, tokenCreate } from './_utils'
import * as userAdd from '../knex/user-add'
import * as request from 'supertest'

console.info = jest.fn()
console.error = jest.fn()

beforeEach(async () => {
  await dbManager.populateDb()
})

afterEach(async () => {
  await dbManager.truncateDb()
})

afterAll(async () => {
  dbManager.closeKnex()
})

describe('utilisateurModifier', () => {
  const utilisateurModifierQuery = queryImport('utilisateur-modifier')

  test('ne peut pas modifier un compte (utilisateur anonyme)', async () => {
    const res = await graphQLCall(utilisateurModifierQuery, {
      utilisateur: {
        id: 'test',
        prenom: 'toto-updated',
        nom: 'test-updated',
        email: 'test@camino.local'
      }
    })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test('peut modifier son compte utilisateur', async () => {
    await userAdd(knex, {
      id: 'test',
      prenom: 'toto',
      nom: 'test',
      email: 'test@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'defaut'
    })

    const token = tokenCreate({ id: 'test' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurModifierQuery,
        variables: {
          utilisateur: {
            id: 'test',
            prenom: 'toto-updated',
            nom: 'test-updated',
            email: 'test@camino.local'
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: {
        utilisateurModifier: {
          id: 'test'
        }
      }
    })
  })
})

describe('utilisateursCreer', () => {
  const utilisateurCreerQuery = queryImport('utilisateur-creer')

  test("ne peut pas créer de compte sans token ou si le token ne contient pas d'email", async () => {
    const res = await graphQLCall(utilisateurCreerQuery, {
      utilisateur: {
        prenom: 'toto',
        nom: 'test',
        email: 'test@camino.local',
        motDePasse: 'mot-de-passe'
      }
    })

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer un utilisateur/
    )
  })

  test('crée un compte utilisateur si le token contient son email', async () => {
    const token = tokenCreate({ email: 'test@camino.local' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'test@camino.local',
            motDePasse: 'mot-de-passe'
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: {
        utilisateurCreer: {
          prenom: 'toto'
        }
      }
    })
  })

  test("en tant que 'defaut', ne peut pas créer de compte 'super'", async () => {
    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'toto',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          permissionId: 'super'
        }
      },
      'defaut'
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer un super utilisateur/
    )
  })

  test("en tant que 'defaut', ne peut pas créer de compte avec un email différent", async () => {
    const token = tokenCreate({ id: 'defaut', email: 'test@camino.local' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'autre@camino.local',
            motDePasse: 'mot-de-passe'
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer un utilisateur/
    )
  })

  test("en tant que 'super', peut créer un compte utilisateur 'super'", async () => {
    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'toto',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          permissionId: 'super'
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: {
        utilisateurCreer: {
          prenom: 'toto'
        }
      }
    })
  })

  test("en tant que 'defaut', ne peut pas être associé à une administration", async () => {
    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'toto',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          administrations: [{ id: 'administration' }]
        }
      },
      'defaut'
    )

    expect(res.body.errors[0].message).toMatch(
      /les permissions de cet utilisateur ne permettent pas de l'associer à une administration/
    )
  })

  test("en tant qu'admin', peut être associé à une administrations", async () => {
    await knex('administrations_types').insert({
      id: 'adm',
      nom: 'admin',
      ordre: 1
    })

    await knex('administrations').insert({
      id: 'administration',
      nom: 'admin',
      typeId: 'adm'
    })

    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'test',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          permissionId: 'admin',
          administrations: [{ id: 'administration' }]
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: {
        utilisateurCreer: {
          prenom: 'test'
        }
      }
    })
  })

  test("ne peut pas être associé à une entreprise (utilisateur 'defaut')", async () => {
    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'toto',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          entreprises: [{ id: 'entreprise' }]
        }
      },
      'super'
    )

    expect(res.body.errors[0].message).toMatch(
      /les permissions de cet utilisateur ne permettent pas de l'associer à une entreprise/
    )
  })

  test("peut être associé à une entreprise (utilisateur 'entreprise')", async () => {
    await knex('entreprises').insert({
      id: 'entreprise',
      nom: 'entre'
    })

    const res = await graphQLCall(
      utilisateurCreerQuery,
      {
        utilisateur: {
          prenom: 'toto',
          nom: 'test',
          email: 'test@camino.local',
          motDePasse: 'mot-de-passe',
          permissionId: 'entreprise',
          entreprises: [{ id: 'entreprise' }]
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: {
        utilisateurCreer: {
          prenom: 'toto'
        }
      }
    })
  })
})

describe('utilisateurSupprimer', () => {
  const utilisateurSupprimerQuery = queryImport('utilisateur-supprimer')

  test('ne peut pas supprimer un compte (utilisateur anonyme)', async () => {
    const res = await graphQLCall(utilisateurSupprimerQuery, {
      id: 'test'
    })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test('peut supprimer son compte utilisateur', async () => {
    await userAdd(knex, {
      id: 'test',
      prenom: 'toto',
      nom: 'test',
      email: 'test@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'defaut'
    })

    const token = tokenCreate({ id: 'test' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurSupprimerQuery,
        variables: {
          id: 'test'
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: {
        utilisateurSupprimer: {
          id: 'test'
        }
      }
    })
  })

  test('peut supprimer un utilisateur (utilisateur super)', async () => {
    const id = 'user-todelete'
    await userAdd(knex, {
      id,
      prenom: 'userToDelete',
      nom: 'test',
      email: 'user-to-delete@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'defaut'
    })

    const res = await graphQLCall(
      utilisateurSupprimerQuery,
      {
        id
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        utilisateurSupprimer: {
          id
        }
      }
    })
  })

  test('ne peut pas supprimer un utilisateur inexistant (utilisateur super)', async () => {
    const res = await graphQLCall(
      utilisateurSupprimerQuery,
      {
        id: 'toto'
      },
      'super'
    )

    expect(res.body.errors[0].message).toMatch(/aucun utilisateur avec cet id/)
  })
})
