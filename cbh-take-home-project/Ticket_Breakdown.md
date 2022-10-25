# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

##### Time estimation concepts

0.5 - 1 hour
1 - 2 hours
2 - 4 hours
3 - one day

##### Assumption

- `Agents` Table: id, name, etc
- `Shifts` Table: id, facility_id, agent_id, date, etc
- `Facilities` Table: id, info, etc

##### Ticket 1 (New table `FacilityCustomIds`)

[Acceptance criteria]

- Define a table schema `FacilityCustomIds` to store custom ids for each agents by facilities. It should be easy to create/read/update/delete custom ids for each agent by any facilities.
- Write a migration script to add a new table `FacilityCustomIds`

[Time/effort estimation]

- This is a fairly simple task and the following as a time estimation
  - Implementation - 0.5
  - Code review - 0.5
  - QA - 0.5
    Total 1.5

[Implementation details]

- Table schema

  ```
  TABLE FacilityCustomIds (
  FacilityID int,
  AgentID int,
  CustomID int NOT NULL,
  PRIMARY KEY (FacilityID, AgentID)
  FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID)
  FOREIGN KEY (AgentID) REFERENCES Agents(AgentID)
  );
  CREATE UNIQUE INDEX CustomID ON FacilityCustomIds (FacilityID, CustomID);
  ```

- Migration script
  - We don't need to prefill any values to newly created table. The migration script just requires to create a new table with the above schema.

##### Ticket 2 (CRUD for `FacilityCustomIds`)

[Acceptance criteria]

- A function `getAgentCustomID` is called with the Facility's id & Agent's id, returning the custom id which is added by that Facility.
- A function `setAgentCustomID` is called by the facilities when they want to add a custom id to a certain agent. Parameters are Facility's id, Agent's id & Custom id. If there was already set custom id, then it should replace that with new custom id. The custom ID can be null and it requires to delete that custom id.
- A function `setAgentCustmoID` should return Error if (FacilityID and CustomID) is not unique
- A function `getAgentCustomID` & `setAgentCustomID` should return Error when the input(Facilty's id & Agent's id) is not valid

[Time/effort estimation]

- Implementation - 1
- Code review - 1
- QA - 1
  Total 3

[Implementation details (Pseudo)]

- `getAgentCustomID(facilityId, agentId)`

```
function getAgentCustomID(facilityId, agentId) {
    if facilityId is invalid / is not in Facilities table
        return Error
    if agentId is invalid / is not in Agents table
        return Error
    find a record in FacilityCustomIDs where facilityId = facilityId, agentId = agentId
    return record.customId
}
```

- `setAgentCustomID(facilityId, agentId, customID)`

```
function getAgentCustomID(facilityId, agentId, customId) {
    if facilityId is invalid / is not in Facilities table
        return Error
    if agentId is invalid / is not in Agents table
        return Error
    find a record in FacilityCustomIDs where facilityId = facilityId, agentId = agentId
    if customId is null
        delete(record)
        return
    if record is valid
        record.customId = customId
    else
        try
            create a new record in FacilityCustomIDs (facilityId = facilityId, agentId = agentId, customId = customId)
        catch (error)
            // There may already be a duplicate key pair (facilityId, customId)
            return Error
}
```

##### Ticket 3 (Refactor `generateReport`)

[Acceptance criteria]

- Update `generateReport` to print the custom ids instead of agent ids.
- In case if there is no custom id set, please be descriptive to label the original agent id with `Internal ID`

[Time/effort estimation]

- Implementation - 1
- Code review - 1
- QA - 1
  Total 3

[Implementation details (Pseudo)]

```
function generateReport(shifts) {
    shifts.forEach(shift => {
        const customId = getAgentCustomID(shift.facilityId, shift.agentId)

        if (customId) {
            // use customId to print
        } else {
            // use shift.agentId with `Internal ID` label
        }
    })
}
```
