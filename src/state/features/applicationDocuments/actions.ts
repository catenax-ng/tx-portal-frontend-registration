/********************************************************************************
 * Copyright (c) 2021, 2023 BMW Group AG
 * Copyright (c) 2021, 2023 Contributors to the Eclipse Foundation
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

import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit'
import documentSlice from './slice'
import { Api } from './api'
import { DocumentType } from './types'
import { ProgressType } from '../../../types/MainTypes'
import { downloadDocument } from '../../../helpers/utils'
import { setStatusCode } from '../statusCodeError'

const handleUpdateProgress = (
  progress: ProgressType,
  dispatch: Dispatch,
  temporaryId: string
) => {
  const { loaded, total } = progress
  const percentageProgress = Math.floor((loaded / total) * 100)
  dispatch(
    documentSlice.actions.updateProgressBar({ temporaryId, percentageProgress })
  )
}

const fetchDocuments = createAsyncThunk(
  'registration/application/user/fetchDocuments',
  async ({applicationId, dispatch}: {applicationId: string, dispatch: Dispatch}) => {
    try {
      dispatch(setStatusCode({ errorCode: '' }))
      return await Api.getInstance().getDocuments(
        applicationId,
        DocumentType.COMMERCIAL_REGISTER_EXTRACT
      )
    } catch (error: any) {
      console.error('api call error:', error)
      dispatch(setStatusCode({ errorCode: error.response.status }))
      throw Error('Unable to load documents. Please contact the administrator.')
    }
  }
)

const fetchDocumentByDocumentId = createAsyncThunk(
  'registration/application/user/fetchDocumentByDocumentId',
  async ({
    documentId,
    documentName,
    dispatch
  }: {
    documentId: string
    documentName: string
    dispatch: Dispatch
  }) => {
    try {
      const { data, headers } = await Api.getInstance().getDocumentByDocumentId(
        documentId
      )
      dispatch(setStatusCode({ errorCode: '' }))
      return downloadDocument(data, headers['content-type'], documentName)
    } catch (error: any) {
      console.error('api call error:', error)
      dispatch(setStatusCode({ errorCode: error.response.status }))
      throw Error(
        'Unable to download document. Please contact the administrator.'
      )
    }
  }
)

const saveDocument = createAsyncThunk(
  `registration/application/companyDetailsWithAddress/save`,
  async (
    {
      applicationId,
      document,
      temporaryId,
    }: {
      applicationId: string
      document: File
      temporaryId: string
    },
    { dispatch }
  ) => {
    try {
      return await Api.getInstance().postDocument({
        applicationId,
        documentTypeId: DocumentType.COMMERCIAL_REGISTER_EXTRACT,
        file: document,
        handleUpdateProgress,
        dispatch,
        temporaryId,
      })
    } catch (error: unknown) {
      console.error('api call error:', error)
      throw Error('Unable to save documents. Please contact the administrator.')
    }
  }
)

const deleteDocument = createAsyncThunk(
  `registration/application/document/delete`,
  async (documentId: string) => {
    try {
      return await Api.getInstance().deleteDocument(documentId)
    } catch (error: unknown) {
      console.error('api call error:', error)
      throw Error(
        'Unable to delete documents. Please contact the administrator.'
      )
    }
  }
)

export {
  fetchDocuments,
  saveDocument,
  deleteDocument,
  fetchDocumentByDocumentId,
}
