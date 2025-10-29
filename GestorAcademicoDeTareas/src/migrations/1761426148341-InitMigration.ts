import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1761426148341 implements MigrationInterface {
    name = 'InitMigration1761426148341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`role\` enum ('student', 'professor') NOT NULL DEFAULT 'student', \`passwordHash\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`description\` text NOT NULL, \`dueDate\` date NULL, \`isCompleted\` tinyint NOT NULL DEFAULT 0, \`deadline\` timestamp NULL, \`studentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`grades\` (\`id\` int NOT NULL AUTO_INCREMENT, \`score\` int NOT NULL, \`studentId\` int NULL, \`taskId\` int NULL, UNIQUE INDEX \`REL_20d63a82edac94fb284aaa1677\` (\`taskId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_94722dcc23289e9f2e051a18332\` FOREIGN KEY (\`studentId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`grades\` ADD CONSTRAINT \`FK_fcfc027e4e5fb37a4372e688070\` FOREIGN KEY (\`studentId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`grades\` ADD CONSTRAINT \`FK_20d63a82edac94fb284aaa16772\` FOREIGN KEY (\`taskId\`) REFERENCES \`tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`grades\` DROP FOREIGN KEY \`FK_20d63a82edac94fb284aaa16772\``);
        await queryRunner.query(`ALTER TABLE \`grades\` DROP FOREIGN KEY \`FK_fcfc027e4e5fb37a4372e688070\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_94722dcc23289e9f2e051a18332\``);
        await queryRunner.query(`DROP INDEX \`REL_20d63a82edac94fb284aaa1677\` ON \`grades\``);
        await queryRunner.query(`DROP TABLE \`grades\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
