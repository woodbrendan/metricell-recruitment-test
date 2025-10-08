# Metricell recruitment test

List the contents of the Employees table in the SQLite database included in the base project.

Add functionality so that you can add, remove and modify the items of that table.

Create a button in the interface that triggers the following SQL queries. Ensure that the front end is updated dynamically every time the data in the database is modified:
- Increment the field `Value` by 1 where the field `Name` starts with ‘E’, by 10 where `Name` starts with ‘G’ and all others by 100.
- List the sum of all Values for all Names that begin with A, B or C but only present the data where the summed values are greater than or equal to 11171

## Required environment

The base project is using the most recent version of visual studio community with the following technologies: 

- SQLite - database 
- ASP.NET - backend 
- React – frontend

## Getting Started
> [!NOTE]  
> Make sure you run these commands from the project root directory.

### 1. Clone the Repository
```
git clone https://github.com/woodbrendan/metricell-recruitment-test.git
cd metricell-recruitment-test
```

### 2. Install Dependencies
Front End:
```
cd InterviewTest.client
npm install
```
Back End:
```
cd InterviewTest.server
dotnet restore
```

### 3. Run the Application
```
dotnet run --project InterviewTest.server
```

