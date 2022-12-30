import neo4j from "neo4j-driver";
import dotenv from "dotenv";
dotenv.config();

export const db = class {
  constructor() {
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USERNAME.toString();
    const password = process.env.NEO4J_PASSWORD.toString();

    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
};

export const StudentClass = class extends db {
  createStudent = async (name, faculty) => {
    const session = this.driver.session({ database: "neo4j" });
    try {
      const writeQuery = `MERGE (n:Student {name: $name, faculty: $faculty})`;

      await session.executeWrite((tx) => tx.run(writeQuery, { name, faculty }));
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  deleteStudent = async (name, faculty) => {
    const session = this.driver.session({ database: "neo4j" });
    try {
      const writeQuery = `MATCH (n:Student {name: $name, faculty: $faculty}) DETACH DELETE n`;

      await session.executeWrite((tx) => tx.run(writeQuery, { name, faculty }));
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  listStudents = async () => {
    const session = this.driver.session({ database: "neo4j" });

    try {
      const readQuery = `MATCH (n:Student) RETURN n`;

      const readResult = await session.executeRead((tx) => tx.run(readQuery));

      const Students = readResult.records.map((record) => {
        const p = record.get("n");
        return { name: p.properties.name, faculty: p.properties.faculty };
      });

      return Students;
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  listParticipation = async () => {
    const session = this.driver.session({ database: "neo4j" });

    try {
      const readQuery = `MATCH n=()-[:PARTICIPATES_IN]->() RETURN n`;

      const readResult = await session.executeRead((tx) => tx.run(readQuery));

      const Students = readResult.records.map((record) => {
        const p = record.get("n");
        return {
          name: p.start.properties.name,
          faculty: p.start.properties.faculty,
          class: p.end.properties.name,
        };
      });

      return Students;
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  findStudent = async (name) => {
    const session = this.driver.session({ database: "neo4j" });

    try {
      const readQuery = `MATCH (p:Student)
                            WHERE p.name = $name
                            RETURN p`;

      const readResult = await session.executeRead((tx) =>
        tx.run(readQuery, { name })
      );

    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  createParticipation = async (name, faculty, activity) => {
    const session = this.driver.session({ database: "neo4j" });

    try {
      const writeQuery = `MERGE (p1:Student { name: $name, faculty: $faculty  })
                                MERGE (p2:Class { name: $activity})
                                MERGE (p1)-[:PARTICIPATES_IN]->(p2)
                                RETURN p1, p2`;

      const writeResult = await session.executeWrite((tx) =>
        tx.run(writeQuery, { name, activity, faculty })
      );

      writeResult.records.forEach((record) => {
        const person1Node = record.get("p1");
        const person2Node = record.get("p2");
        console.info(
          `Created friendship between: ${person1Node.properties.name}, ${person2Node.properties.name}`
        );
      });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  deleteParticipation = async (name, faculty, activity) => {
    const session = this.driver.session({ database: "neo4j" });

    try {
      const writeQuery = `MATCH (p1:Student { name: $name, faculty: $faculty  })-[r:PARTICIPATES_IN]->(p2:Class {name: $activity}) DELETE r`;

      const writeResult = await session.executeWrite((tx) =>
        tx.run(writeQuery, { name, activity, faculty })
      );
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };
};

export const TeacherClass = class extends db {
  createTeacher = async (name, faculty) => {
    const session = this.driver.session({ database: "neo4j" });
    try {
      const writeQuery = `MERGE (n:Teacher {name: $name, faculty: $faculty})`;

      await session.executeWrite((tx) => tx.run(writeQuery, { name, faculty }));
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  deleteTeacher = async (name, faculty) => {
    const session = this.driver.session({ database: "neo4j" });
    try {
      const writeQuery = `MERGE (n:Teacher {name: $name, faculty: $faculty})
    DETACH DELETE n`;

      await session.executeWrite((tx) => tx.run(writeQuery, { name, faculty }));
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  listTeachers = async () => {
    const session = this.driver.session({ database: "neo4j" });

    try {
      const readQuery = `MATCH (n:Teacher) RETURN n`;

      const readResult = await session.executeRead((tx) => tx.run(readQuery));

      const Students = readResult.records.map((record) => {
        const p = record.get("n");
        return { name: p.properties.name, faculty: p.properties.faculty };
      });

      return Students;
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  listParticipation = async () => {
    const session = this.driver.session({ database: "neo4j" });

    try {
      const readQuery = `MATCH n=()-[:TEACHES]->() RETURN n`;

      const readResult = await session.executeRead((tx) => tx.run(readQuery));

      const Students = readResult.records.map((record) => {
        const p = record.get("n");
        return {
          name: p.start.properties.name,
          faculty: p.start.properties.faculty,
          class: p.end.properties.name,
        };
      });

      return Students;
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  createParticipation = async (name, faculty, activity) => {
    const session = this.driver.session({ database: "neo4j" });

    try {
      const writeQuery = `MERGE (p1:Teacher { name: $name, faculty: $faculty  })
                                MERGE (p2:Class { name: $activity})
                                MERGE (p1)-[:TEACHES]->(p2)
                                RETURN p1, p2`;

      const writeResult = await session.executeWrite((tx) =>
        tx.run(writeQuery, { name, activity, faculty })
      );

      writeResult.records.forEach((record) => {
        const person1Node = record.get("p1");
        const person2Node = record.get("p2");
        console.info(
          `Created friendship between: ${person1Node.properties.name}, ${person2Node.properties.name}`
        );
      });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  deleteParticipation = async (name, faculty, activity) => {
    const session = this.driver.session({ database: "neo4j" });

    try {
      const writeQuery = `MATCH (p1:Teacher { name: $name, faculty: $faculty  })-[r:TEACHES]->(p2:Class {name: $activity}) DELETE r`;

      const writeResult = await session.executeWrite((tx) =>
        tx.run(writeQuery, { name, activity, faculty })
      );
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };
};

export const ActivityClass = class extends db {
  createClass = async (name) => {
    const session = this.driver.session({ database: "neo4j" });
    try {
      const writeQuery = `MERGE (n:Class {name: $name})`;

      await session.executeWrite((tx) => tx.run(writeQuery, { name }));
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  deleteClass = async (name) => {
    const session = this.driver.session({ database: "neo4j" });
    try {
      const writeQuery = `MATCH (n:Class {name: $name}) DETACH DELETE n`;

      await session.executeWrite((tx) => tx.run(writeQuery, { name }));
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  findStudent = async (driver, name) => {
    const session = driver.session({ database: "neo4j" });

    try {
      const readQuery = `MATCH (p:Class)
                            WHERE p.name = $name
                            RETURN p`;

      const readResult = await session.executeRead((tx) =>
        tx.run(readQuery, { name })
      );


    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };

  listActivities = async () => {
    const session = this.driver.session({ database: "neo4j" });

    try {
      const readQuery = `MATCH (n:Class) RETURN n`;

      const readResult = await session.executeRead((tx) => tx.run(readQuery));

      const Students = readResult.records.map((record) => {
        const p = record.get("n");
        return { name: p.properties.name, faculty: p.properties.faculty };
      });

      return Students;
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
    }
  };
};
