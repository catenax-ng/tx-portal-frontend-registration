/********************************************************************************
 * Copyright (c) 2022 BMW Group AG
 * Copyright (c) 2022 Contributors to the Eclipse Foundation
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

declare const ENV: Record<string, string>

export const getApiBase = () => ENV.PORTAL_BACKEND_URL ?? ''

export const getAssetBase = () => ENV.PORTAL_ASSETS_URL ?? ''

export const getCentralIdp = () => ENV.CENTRALIDP_URL ?? ''

export const getRealm = () => ENV.REALM ?? ''

export const getClientIdRegistration = () => ENV.CLIENT_ID_REGISTRATION ?? ''

const EnvironmentService = {
  getRealm,
  getClientIdRegistration,
  getCentralIdp,
  getApiBase,
  getAssetBase,
}

export default EnvironmentService
