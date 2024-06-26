#!/bin/bash

###############################################################
# Copyright (c) 2023 Contributors to the Eclipse Foundation
#
# See the NOTICE file(s) distributed with this work for additional
# information regarding copyright ownership.
#
# This program and the accompanying materials are made available under the
# terms of the Apache License, Version 2.0 which is available at
# https://www.apache.org/licenses/LICENSE-2.0.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# SPDX-License-Identifier: Apache-2.0
###############################################################

# Define custom variable
custom_env_vars='{PORTAL_ASSETS_URL:"'$PORTAL_ASSETS_URL'",PORTAL_BACKEND_URL:"'$PORTAL_BACKEND_URL'",CENTRALIDP_URL:"'$CENTRALIDP_URL'",REALM:"'$REALM'",CLIENT_ID_REGISTRATION:"'$CLIENT_ID_REGISTRATION'"}'
# Define anchor variable
custom_env_vars_anchor='{PORTAL_ASSETS_URL:"http://localhost:3000/assets",PORTAL_BACKEND_URL:"https://portal-backend.example.org",CENTRALIDP_URL:"https://centralidp.example.org/auth",REALM:"CX-Central",CLIENT_ID_REGISTRATION:"Cl1-CX-Registration"}'
# Read content of the reference index.html file into the index_html_reference variable
index_html_reference=`cat /usr/share/nginx/html/index.html.reference`
# Replace the anchor variable with the custom variable in the index.html file 
index_html=${index_html_reference//$custom_env_vars_anchor/$custom_env_vars}
# Write the modified index.html to tmp (to enable readOnlyRootFilesystem)
echo "$index_html" > /tmp/index.html
