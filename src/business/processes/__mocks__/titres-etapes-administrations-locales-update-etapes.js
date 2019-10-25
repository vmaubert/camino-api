const administrations = [
  {
    id: 'centrale',
    domaines: [{ id: 'm' }]
  },
  {
    id: 'deal-01',
    departementId: '01'
  },
  {
    id: 'deal-01',
    regionId: '02'
  },
  {
    id: 'ope-onf-973-01',
    departementId: '973'
  },
  {
    id: 'xxxx',
    departementId: 'xxxx'
  }
]

const titresEtapesCommunes = [
  {
    id: 'titre-id',
    domaineId: 'h',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            communes: [
              {
                id: 'paris',
                departementId: '01',
                departement: { regionId: '01' }
              },
              {
                id: 'issy',
                departementId: '01',
                departement: { regionId: '01' }
              },
              {
                id: 'ivry',
                departementId: '02',
                departement: { regionId: '02' }
              },
              {
                id: 'evry',
                departementId: '02',
                departement: { regionId: '02' }
              }
            ]
          },
          {
            typeId: 'chh',
            communes: [{}]
          }
        ]
      }
    ]
  }
]

const titresEtapesCommunesVides = [
  {
    id: 'titre-id',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11',
            communes: []
          }
        ]
      }
    ]
  }
]

const titresEtapesCommunesMemeCommune = [
  {
    id: 'titre-id',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11',
            communes: [
              { departementId: '01', departement: { regionId: '01' } },
              { departementId: '01', departement: { regionId: '01' } }
            ]
          }
        ]
      }
    ]
  }
]

const titresEtapesAdministrationLocalesInexistante = [
  {
    id: 'titre-id',
    domaineId: 'h',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            communes: [],
            administrations: [
              {
                id: 'xxx'
              }
            ]
          }
        ]
      }
    ]
  }
]

const titresEtapesAdministrationLocalesExistante = [
  {
    id: 'titre-id',
    domaineId: 'h',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            communes: [
              { departementId: '01', departement: { regionId: '01' } }
            ],
            administrations: [
              {
                id: 'deal-01'
              }
            ]
          }
        ]
      }
    ]
  }
]

const titresArm = [
  {
    id: 'titre-id',
    typeId: 'arm',
    domaineId: 'm',
    demarches: [
      {
        etapes: [
          {
            id: 'm-arm-crique-saint-doux-oct01-men01',
            titreDemarcheId: 'm-arm-crique-saint-doux-oct01',
            typeId: 'men',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11',
            communes: [
              {
                departementId: '973'
              }
            ]
          }
        ]
      }
    ]
  }
]

const titresAxm = [
  {
    id: 'titre-id',
    typeId: 'axm',
    domaineId: 'm',
    demarches: [
      {
        etapes: [
          {
            id: 'm-axm-crique-saint-doux-oct01-men01',
            titreDemarcheId: 'm-axm-crique-saint-doux-oct01',
            typeId: 'men',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11',
            communes: [
              {
                departementId: '973'
              }
            ]
          }
        ]
      }
    ]
  }
]

export {
  administrations,
  titresEtapesCommunes,
  titresEtapesCommunesVides,
  titresEtapesCommunesMemeCommune,
  titresEtapesAdministrationLocalesInexistante,
  titresEtapesAdministrationLocalesExistante,
  titresArm,
  titresAxm
}