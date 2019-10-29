/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
 * graphic logo are (registered/a) trademark(s) of Plan International.
 */
import chalk from 'chalk'
import {
  ILocationSequenceNumber,
  matchLocationWithA2IRef
} from '@resources/bgd/features/utils'
import * as fs from 'fs'
import {
  ADMIN_STRUCTURE_SOURCE,
  SEQUENCE_NUMBER_SOURCE
} from '@resources/bgd/constants'
import LocationSequenceNumber, {
  ILocationSequenceNumberModel
} from '@resources/bgd/features/generate/sequenceNumbers/model/locationSequenceNumber'
import { createLocationWiseSeqNumbers } from '@resources/bgd/features/generate/sequenceNumbers/service'

const unionsNumbers = JSON.parse(
  fs.readFileSync(`${SEQUENCE_NUMBER_SOURCE}/generated/unions.json`).toString()
)

async function prepareAndSaveLocationSequenceNumber(
  locations: fhir.Location[],
  locWiseSeqNumbers: ILocationSequenceNumber[]
): Promise<ILocationSequenceNumberModel[]> {
  const locationsWiseSeqNumbers: ILocationSequenceNumberModel[] = []
  for (const locWiseSeqNum of locWiseSeqNumbers) {
    const location = locations.find(loc =>
      matchLocationWithA2IRef(loc, locWiseSeqNum.reference)
    )
    if (!location) {
      // tslint:disable-next-line:no-console
      console.log(
        `${chalk.red('Warning:')} No location can be found that matches: ${
          locWiseSeqNum.reference
        }`
      )
      continue
    }
    // tslint:disable-next-line:no-console
    console.log(`Saving sequence number for location: ${location.id}`)
    locationsWiseSeqNumbers.push(
      new LocationSequenceNumber({
        locationId: locations[0].id,
        lastUsedSequenceNumber: locWiseSeqNum.sequence_number
      })
    )
  }
  return locationsWiseSeqNumbers
}

export default async function saveSequenceNumberData() {
  // tslint:disable-next-line:no-console
  console.log(
    `${chalk.blueBright(
      '/////////////////////////// ADDING LOCATION WISE SEQUENCE NUMBER IN RESOURCE DB ///////////////////////////'
    )}`
  )

  const unions = JSON.parse(
    fs.readFileSync(`${ADMIN_STRUCTURE_SOURCE}locations/unions.json`).toString()
  )
  // Preparing union wise sequence numbers
  const sequenceNumberModels = await prepareAndSaveLocationSequenceNumber(
    unions.unions,
    unionsNumbers
  )

  if (sequenceNumberModels.length === 0) {
    return false
  }
  // Storing sequence numbers on resource db
  createLocationWiseSeqNumbers(sequenceNumberModels)
  return true
}

saveSequenceNumberData()
