import titreDemarcheStatutIdFind from './titre-demarche-statut-id-find'
import {
  titreDemarcheOctDpuAcc,
  titreAxmDemarcheOctDexAcc,
  titrePrxDemarcheOctRpuAcc,
  titreDemarcheProDpuAcc,
  titreDemarcheOctDexAcc,
  titreDemarcheOctDexRej,
  titreDemarcheOctMenIns,
  titreDemarcheOctMenInd,
  titreDemarcheOctRet,
  titreDemarcheOctMdp,
  titreDemarcheOctMfr,
  titreDemarcheOctMreDef,
  titreDemarcheOctMreInd,
  titreDemarcheRetDpuFai,
  titreDemarcheRetDpuIni,
  titreDemarcheIndefinie
} from './__mocks__/titre-demarche-statut-id-find-demarches'

test("une démarche d'octroi dont l'étape de dpu la plus récente est acceptée a le statut “acceptée”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheOctDpuAcc)).toEqual('acc')
})

test("une démarche d'octroi d'un titre AXM dont l'étape de dex la plus récente est acceptée a le statut “acceptée”", () => {
  expect(titreDemarcheStatutIdFind(titreAxmDemarcheOctDexAcc, 'axm')).toEqual(
    'acc'
  )
})

test("une démarche d'octroi d'un titre PRX dont l'étape de rpu la plus récente est acceptée a le statut “acceptée”", () => {
  expect(titreDemarcheStatutIdFind(titrePrxDemarcheOctRpuAcc, 'prx')).toEqual(
    'acc'
  )
})

test("une démarche de prolongation dont l'étape de dpu la plus récente est acceptée a le statut “acceptée”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheProDpuAcc)).toEqual('acc')
})

test("une démarche d'octroi ne contenant une unique étape de dex acceptée a le statut “indéfinie”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheOctDexAcc)).toEqual('ind')
})

test("une démarche d'octroi dont l'unique étape de dex est rejetée a le statut “rejetée”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheOctDexRej)).toEqual('rej')
})

test("une démarche d'octroi dont l'étape de men est antérieure à aujourd'hui a le statut “en instruction”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheOctMenIns)).toEqual('ins')
})

test("une démarche d'octroi dont l'étape de men est postérieure à aujourd'hui a le statut “indéfinie”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheOctMenInd)).toEqual('ind')
})

test("une démarche d'octroi dont l'étape la plus récente est ret a le statut “retirée”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheOctRet)).toEqual('ret')
})

test("une démarche d'octroi dont l'étape la plus récente est mdp a le statut “déposée”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheOctMdp)).toEqual('dep')
})

test("une démarche d'octroi dont l'étape la plus récente est mfr a le statut “en construction”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheOctMfr)).toEqual('eco')
})

test("une démarche d'octroi dont l'étape la plus récente est mre et a été faite a le statut “classée sans suite”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheOctMreDef)).toEqual('cls')
})

test("une démarche d'octroi dont l'étape la plus récente est mre et n'a pas été faite a le statut “indéfinie”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheOctMreInd)).toEqual('ind')
})

test("une démarche de retrait dont l'étape la plus récente de dpu a été faite a le statut “indéfinie”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheRetDpuFai)).toEqual('ter')
})

test("une démarche de retrait dont l'étape la plus récente de dpu n'a pas encore été faite a le statut “initiée”", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheRetDpuIni)).toEqual('ini')
})

test('une démarche inexistante a le statut “indéfinie”', () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheIndefinie)).toEqual('ind')
})