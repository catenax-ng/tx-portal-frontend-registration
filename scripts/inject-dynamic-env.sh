#!/bin/bash

# Copyright (c) 2021,2022,2023 Contributors to the Eclipse Foundation

# See the NOTICE file(s) distributed with this work for additional
# information regarding copyright ownership.

# This program and the accompanying materials are made available under the
# terms of the Apache License, Version 2.0 which is available at
# https://www.apache.org/licenses/LICENSE-2.0.

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

# SPDX-License-Identifier: Apache-2.0

custom_env_vars='{PORTAL_FRONTEND_URL:"'$PORTAL_FRONTEND_URL'",PORTAL_BACKEND_URL:"'$PORTAL_BACKEND_URL'",CENTRALIDP_URL:"'$CENTRALIDP_URL'"}'
custom_env_vars_anchor='{PORTAL_FRONTEND_URL:"https://portal.dummy",PORTAL_BACKEND_URL:"https://portal-backend.dummy",CENTRALIDP_URL:"https://centralidp.dummy/auth"}'
index_html_reference=`cat /usr/share/nginx/html/index.html.reference`
index_html=${index_html_reference//$custom_env_vars_anchor/$custom_env_vars}
echo "$index_html" > /usr/share/nginx/html/index.html
echo "Environment config successfully injected into index.html"