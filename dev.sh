# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.
#
# OpenCRVS is also distributed under the terms of the Civil Registration
# & Healthcare Disclaimer located at http://opencrvs.org/license.
#
# Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
# graphic logo are (registered/a) trademark(s) of Plan International.
set -e
print_usage_and_exit () {
    echo
    echo -e 'Usage: \033[32mdev.sh PATH_TO_OPEN_CRVS_CORE_DIRECTORY\033[0m'
    echo
    echo "PATH_TO_OPEN_CRVS_CORE_DIRECTORY must be provided"
    echo
    echo "Open a terminal window and cd into the opencrvs-core directory. Then type:"
    echo
    echo -e "\033[32mpwd\033[0m"
    echo
    echo "This will display the absolute path to the opencrvs-core directory that must be provided here."
    echo
    exit 1
}

if [ -z "$1" ] ; then
    echo 'Error: Argument PATH_TO_OPEN_CRVS_CORE_DIRECTORY is required in position 1.'
    print_usage_and_exit
fi
PATH_TO_OPEN_CRVS_CORE_DIRECTORY=$1
export CERT_PUBLIC_KEY_PATH=$PATH_TO_OPEN_CRVS_CORE_DIRECTORY/.secrets/public-key.pem
echo $CERT_PUBLIC_KEY_PATH
yarn start