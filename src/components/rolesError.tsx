/********************************************************************************
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

import { useTranslation } from 'react-i18next'

function RolesError({ retry }) {
  const { t } = useTranslation()

  return (
    <div className="roles-error-container">
      <h4>{t('companyRole.NoRolesError1')}</h4>
      <h4>
        {t('companyRole.Please')}{' '}
        <span
          onClick={retry}
          onKeyUp={() => {
            // do nothing
          }}
        >
          {t('companyRole.Retry')}
        </span>{' '}
        {t('companyRole.NoRolesError2')}{' '}
      </h4>
    </div>
  )
}

export default RolesError
