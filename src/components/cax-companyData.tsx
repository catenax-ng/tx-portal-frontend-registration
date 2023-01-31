/********************************************************************************
 * Copyright (c) 2021,2022 Microsoft and BMW Group AG
 * Copyright (c) 2021,2022 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import { Row } from 'react-bootstrap'
import { getCompanyDetails, PATTERNS } from '../helpers/utils'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import SearchInput from 'react-search-input'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { FooterButton } from './footerButton'
import { connect, useDispatch, useSelector } from 'react-redux'
import { IState } from '../state/features/user/redux.store.types'
import { addCurrentStep, addCompanyData } from '../state/features/user/action'
import { withRouter } from 'react-router-dom'
import { Dispatch } from 'redux'
import { DataErrorCodes } from '../helpers/DataError'
import { toast } from 'react-toastify'
import {
  getCompanyDetailsWithAddress,
  getUniqueIdentifier,
  saveCompanyDetailsWithAddress,
} from '../state/features/application/actions'
import { applicationSelector } from '../state/features/application/slice'
import { CompanyDetails } from '../state/features/application/types'
import { isBPN } from '../types/Patterns'

interface CompanyDataProps {
  currentActiveStep: number
  addCurrentStep: (step: number) => void
  addCompanyData: (companydata: CompanyDetails) => void
}

const initialErrors = {
  legalEntity: '',
  registeredName: '',
  streetHouseNumber: '',
  postalCode: '',
  city: '',
  country: '',
  identifierNumber: ''
}

export const CompanyDataCax = ({
  currentActiveStep,
  addCurrentStep,
}: CompanyDataProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [nextClicked, setNextClicked] = useState(false)

  const { status, error, loading, saveError, companyDetails, identifierDetails } = useSelector(applicationSelector)

  if (nextClicked && !loading) {
    if (saveError) {
      toast.error(t('registrationStepOne.submitError'))
    } else {
      addCurrentStep(currentActiveStep + 1)
    }
  }

  const obj = status[status.length - 1] //.find(o => o['applicationStatus'] === CREATED);
  const applicationId = obj['applicationId']
  if (error) {
    toast.error(error)
  }

  useEffect(() => {
    dispatch(getCompanyDetailsWithAddress(applicationId))
  }, [dispatch])

  useEffect(() => {
    setBpn(companyDetails?.bpn)
    setLegalEntity(companyDetails?.shortName)
    setRegisteredName(companyDetails?.name)
    setStreetHouseNumber(companyDetails?.streetName)
    setPostalCode(companyDetails?.zipCode)
    setCity(companyDetails?.city)
    setCountry(companyDetails?.countryAlpha2Code)
    companyDetails?.countryAlpha2Code && dispatch(getUniqueIdentifier(companyDetails?.countryAlpha2Code))
    setUniqueIds(companyDetails?.uniqueIds)
    setIdentifierNumber(companyDetails?.uniqueIds?.[0]?.value)
    setIdentifierType(companyDetails?.uniqueIds?.[0]?.type)
  }, [companyDetails])

  useEffect(() => {
    if (identifierDetails.length > 0) {
      setShowIdentifiers(true)
    }
  }, [identifierDetails])

  const [bpn, setBpn] = useState(companyDetails?.bpn)
  const [bpnErrorMsg, setBpnErrorMessage] = useState('')
  const [legalEntity, setLegalEntity] = useState(companyDetails.shortName)
  const [registeredName, setRegisteredName] = useState(companyDetails.name)
  const [streetHouseNumber, setStreetHouseNumber] = useState(
    companyDetails.streetName
  )
  const [postalCode, setPostalCode] = useState(companyDetails.zipCode)
  const [city, setCity] = useState(companyDetails.city)
  const [country, setCountry] = useState(companyDetails.countryAlpha2Code)
  const [showIdentifiers, setShowIdentifiers] = useState(false)
  const [uniqueIds, setUniqueIds] = useState<any>()
  const [identifierType, setIdentifierType] = useState<string>()
  const [identifierNumber, setIdentifierNumber] = useState<string>()
  const [errors, setErrors] = useState(initialErrors)

  useEffect(() => {
    validateCountry(country)
    identifierNumber && identifierType && validateIdentifierNumber(identifierNumber)
  }, [identifierType, identifierNumber, country])

  const fetchData = async (expr: string) => {
    const details = await getCompanyDetails(expr)
    setBpn(details['bpn'])
    setLegalEntity(details['shortName'])
    setRegisteredName(details['name'])
    setStreetHouseNumber(details['streetName'])
    setPostalCode(details['zipcode'])
    setCity(details['city'])
    setCountry(details['countryAlpha2Code'])
    setUniqueIds(details['uniqueIds'])
    setIdentifierNumber(details['uniqueIds'].length > 0 ? details['uniqueIds'][0]['value'] : '')
    setIdentifierType(details['uniqueIds'].length > 0 ? details['uniqueIds'][0]['type'] : '')
  }

  const onSearchChange = (expr: string) => {
    if (isBPN(expr.trim())) {
      fetchData(expr)
        // make sure to catch any error
        .catch((errorCode: number) => {
          setBpnErrorMessage(t('registrationStepOne.bpnNotExistError'))
          const message = DataErrorCodes.includes(errorCode)
            ? t(`ErrorMessage.${errorCode}`)
            : t(`ErrorMessage.default`)
          toast.error(message)
        })
      setBpnErrorMessage('')
    } else {
      setBpnErrorMessage(t('registrationStepOne.bpnInvalidError'))
    }
  }

  const validateLegalEntity = (value: string) => {
    setLegalEntity(value)

    if (!PATTERNS.legalEntityPattern.test(value.trim())) {
      return setErrors((prevState) => ({
        ...prevState,
        legalEntity: 'legalEntityError',
      }))
    }

    return setErrors((prevState) => ({ ...prevState, legalEntity: '' }))
  }

  const validateRegisteredName = (value: string) => {
    setRegisteredName(value)

    if (!PATTERNS.registeredNamePattern.test(value.trim())) {
      return setErrors((prevState) => ({
        ...prevState,
        registeredName: 'registerdNameError',
      }))
    }

    return setErrors((prevState) => ({ ...prevState, registeredName: '' }))
  }

  const validateStreetHouseNumber = (value: string) => {
    setStreetHouseNumber(value)

    if (!PATTERNS.streetHouseNumberPattern.test(value.trim())) {
      return setErrors((prevState) => ({
        ...prevState,
        streetHouseNumber: 'streetHouseNumberError',
      }))
    }

    return setErrors((prevState) => ({ ...prevState, streetHouseNumber: '' }))
  }

  const validatePostalCode = (value: string) => {
    setPostalCode(value)

    if (!value) return setErrors((prevState) => ({ ...prevState, postalCode: '' }))

    if (!PATTERNS.postalCodePattern.test(value.trim())) {
      return setErrors((prevState) => ({
        ...prevState,
        postalCode: 'postalCodeError',
      }))
    }

    return setErrors((prevState) => ({ ...prevState, postalCode: '' }))
  }

  const validateCity = (value: string) => {
    setCity(value)

    if (!PATTERNS.cityPattern.test(value.trim())) {
      return setErrors((prevState) => ({
        ...prevState,
        city: 'cityError',
      }))
    }

    return setErrors((prevState) => ({ ...prevState, city: '' }))
  }

  const validateCountry = (value: string) => {
    setCountry(value)
    if (!PATTERNS.countryPattern.test(value.trim())) {
      setShowIdentifiers(false)
      return setErrors((prevState) => ({
        ...prevState,
        country: 'countryError',
      }))
    }
    dispatch(getUniqueIdentifier(value))
    return setErrors((prevState) => ({ ...prevState, country: '' }))
  }

  const validateIdentifierNumber = (value) => {
    setIdentifierNumber(value)
    const countryCode = country === 'DE' || country === 'FR' || country === 'IN' || country === 'MX' ? country : 'Worldwide'
    if (!PATTERNS[countryCode][identifierType].test(value.trim())) {
      return setErrors((prevState) => ({
        ...prevState,
        identifierNumber: countryCode + '_' + identifierType,
      }))
    }
    return setErrors((prevState) => ({ ...prevState, identifierNumber: '' }))
  }

  const handleIdentifierSelect = (type, value) => {
    setIdentifierType(type)
    setIdentifierNumber(value)
  }

  const onIdentifierTypeChange = (e) => {
    setIdentifierType(e.target.value)
  }

  const backClick = () => {
    addCurrentStep(currentActiveStep - 1)
  }

  const nextClick = () => {
    const companyData = { ...companyDetails }
    companyData.bpn = bpn
    companyData.name = legalEntity
    companyData.shortName = registeredName
    companyData.streetName = streetHouseNumber
    companyData.city = city
    companyData.zipCode = postalCode
    companyData.countryAlpha2Code = country
    companyData.uniqueIds = [{
      type: identifierType,
      value: identifierNumber
    }]
    //addCompanyData(companyData)
    dispatch(saveCompanyDetailsWithAddress({ applicationId, companyData }))
    setNextClicked(true)
  }

  return (
    <>
      <div className="mx-auto col-9 container-registration">
        <div className="head-section">
          <div className="mx-auto step-highlight d-flex align-items-center justify-content-center">
            1
          </div>
          <h4 className="mx-auto d-flex align-items-center justify-content-center">
            {t('registrationStepOne.verifyCompayDataHeading')}
          </h4>
          <div className="mx-auto text-center col-9">
            {t('registrationStepOne.verifyCompayDataSubHeading')}
          </div>
        </div>
        <div className="companydata-form">
          <Row className="mx-auto col-9">
            <div className={`form-search ${bpnErrorMsg ? 'error' : ''}`}>
              <label> {t('registrationStepOne.seachDatabase')}</label>
              <SearchInput
                className="search-input"
                value={''}
                onChange={(expr) => onSearchChange(expr)}
              />
              <label>{bpnErrorMsg}</label>
            </div>
          </Row>

          <Row className="col-9 mx-auto">
            <div className="section-divider">
              <span className="text-center">
                {t('registrationStepOne.enterManualText')}
              </span>
            </div>
          </Row>

          <Row className="mx-auto col-9">
            <div className="form-data">
              <label>
                {' '}
                {t('registrationStepOne.bpn')}{' '}
                <AiOutlineQuestionCircle
                  color="#939393"
                  // tip data need to get moved to the locales files
                  data-tip="Displays the bpn and can't get eddited."
                />
              </label>
              <input type="text" disabled value={bpn} />
              <div className="company-hint">
                {t('registrationStepOne.helperText')}
              </div>
            </div>
          </Row>

          <Row className="mx-auto col-9">
            <div className={`form-data ${errors.legalEntity && 'error'}`}>
              <label>
                {' '}
                {t('registrationStepOne.legalEntity')}{' '}
                <AiOutlineQuestionCircle
                  color="#939393"
                  // tip data need to get moved to the locales files
                  data-tip="Legal Company Name"
                />{' '}
              </label>
              <input
                type="text"
                value={legalEntity}
                onChange={(e) => validateLegalEntity(e.target.value)}
              />
              {errors.legalEntity && (
                <label>{t(`registrationStepOne.${errors.legalEntity}`)}</label>
              )}
            </div>
          </Row>

          <Row className="mx-auto col-9">
            <div className={`form-data ${errors.registeredName && 'error'}`}>
              <label>
                {' '}
                {t('registrationStepOne.registeredName')}{' '}
              </label>
              <input
                type="text"
                value={registeredName}
                onChange={(e) => validateRegisteredName(e.target.value)}
              />
              {errors.registeredName && (
                <label>
                  {t(`registrationStepOne.${errors.registeredName}`)}
                </label>
              )}
            </div>
          </Row>

          <Row className="mx-auto col-9">
            <span className="form-heading">
              {t('registrationStepOne.organizationAdd')}
            </span>
          </Row>

          <Row className="mx-auto col-9">
            <div className={`form-data ${errors.streetHouseNumber && 'error'}`}>
              <label> {t('registrationStepOne.streetHouseNumber')} </label>
              <input
                type="text"
                value={streetHouseNumber}
                onChange={(e) => validateStreetHouseNumber(e.target.value)}
              />
              {errors.streetHouseNumber && (
                <label>
                  {t(`registrationStepOne.${errors.streetHouseNumber}`)}
                </label>
              )}
            </div>
          </Row>

          <Row className="mx-auto col-9">
            <div className={`col-4 form-data ${errors.postalCode && 'error'}`}>
              <label> {t('registrationStepOne.postalCode')} </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => validatePostalCode(e.target.value)}
              />
              {errors.postalCode && (
                <label>{t(`registrationStepOne.${errors.postalCode}`)}</label>
              )}
            </div>

            <div className={`col-8 form-data ${errors.city && 'error'}`}>
              <label>{t('registrationStepOne.city')}</label>
              <input
                type="text"
                value={city}
                onChange={(e) => validateCity(e.target.value)}
              />
              {errors.city && (
                <label>{t(`registrationStepOne.${errors.city}`)}</label>
              )}
            </div>
          </Row>

          <Row className="mx-auto col-9">
            <div className={`form-data ${errors.country && 'error'}`}>
              <label>{t('registrationStepOne.country')}</label>
              <input
                type="text"
                value={country}
                onChange={(e) => validateCountry(e.target.value)}
              />
              {errors.country && (
                <label>{t(`registrationStepOne.${errors.country}`)}</label>
              )}
            </div>
          </Row>

          {
            uniqueIds && uniqueIds.length > 1 ?
              (
                <>
                  <Row className="mx-auto col-9">
                    <span className="form-heading">
                      {t('registrationStepOne.countrytIdentifier')}
                    </span>
                  </Row>
                  <Row className="mx-auto col-9">
                    <ul className="agreement-check-list">
                      {uniqueIds.map((id, key) => (
                        <li key={key} className="agreement-li">
                          <input
                            type="radio"
                            name='uniqueIds'
                            value={id.type}
                            className="regular-radio agreement-check"
                            onChange={() => handleIdentifierSelect(id.type, id.value)}
                            defaultChecked={uniqueIds[0].type === id.type}
                          />
                          <label>{t(`registrationStepOne.identifierTypes.${id.type}`)+':'+id.value}</label>
                        </li>
                      ))}
                    </ul>
                  </Row>
                </>
              )
              :
              showIdentifiers &&
              <>
                <Row className="mx-auto col-9">
                  <span className="form-heading">
                    {t('registrationStepOne.countrytIdentifier')}
                  </span>
                </Row>
                <Row className="mx-auto col-9">
                  <div className={`form-data ${errors.streetHouseNumber && 'error'}`}>
                    <label> {t('registrationStepOne.identifierType')} </label>
                    <select value={identifierType} onChange={(e) => onIdentifierTypeChange(e)} disabled={uniqueIds && uniqueIds.length === 1}>
                      <option value="">{t('registrationStepOne.pleaseSelect')}</option>
                      {identifierDetails &&
                        identifierDetails.map((identifier) => (
                          <option key={identifier.id} value={identifier.label}>
                            {t(`registrationStepOne.identifierTypes.${identifier.label}`)}
                          </option>
                        ))}
                    </select>
                  </div>
                </Row>
                <Row className="mx-auto col-9">
                  <div className={`form-data ${errors.identifierNumber && 'error'}`}>
                    <label> {t('registrationStepOne.identifierNumber')} </label>
                    <input
                      type="text"
                      value={identifierNumber}
                      onChange={(e) => validateIdentifierNumber(e.target.value)}
                      disabled={uniqueIds && uniqueIds.length === 1}
                    />
                    {errors.identifierNumber && (
                      <label>
                        {t(`registrationStepOne.${errors.identifierNumber}`)}
                      </label>
                    )}
                  </div>
                </Row>
              </>
          }
        </div>
      </div>
      <FooterButton
        labelNext={t('button.confirm')}
        handleBackClick={() => backClick()}
        handleNextClick={() => nextClick()}
        disabled={!legalEntity || !registeredName || !streetHouseNumber || !city || !country || errors.streetHouseNumber !== '' || errors.country !== '' || errors.postalCode !== '' || errors.identifierNumber !== ''}
      />
    </>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addCurrentStep: (step: number) => {
    dispatch(addCurrentStep(step))
  },
  addCompanyData: (companyData: CompanyDetails) => {
    dispatch(addCompanyData(companyData))
  },
})

export default withRouter(
  connect(
    (state: IState) => ({
      currentActiveStep: state.user.currentStep,
    }),
    mapDispatchToProps
  )(CompanyDataCax)
)

