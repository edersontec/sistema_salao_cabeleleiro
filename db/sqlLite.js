const configDB = require("../configs/sql.lite.config");

const agendamentosDB = configDB.configDatabase("agendamentos.db");

agendamentosDB.exec(`CREATE TABLE IF NOT EXISTS agendamentos 
   (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      nome CHAR(100),
      hora TIME,
      profissional CHAR(100),
      sexo CHAR(20),
      services TEXT,
      createAt DATE NOT NULL
   )`);

function setAgendamentos(agendamento) {
  const insert = agendamentosDB.prepare(`
      INSERT INTO agendamentos (nome, hora, profissional, sexo, services, createAt) 
         VALUES (?, ?, ?, ?, ?, ?)
    `);

  const info = insert.run(
    agendamento.nome,
    agendamento.hora,
    agendamento.profissional,
    agendamento.sexo,
    agendamento.services,
    agendamento.createAt,
  );

  return info.lastInsertRowid;
}

function getAgendamentos(filtro = {}) {
  const campos = Object.keys(filtro);

  if (campos.length === 0) {
    const select = agendamentosDB.prepare(`SELECT * FROM agendamentos`);
    return select.all();
  }

  const where = campos.map((campo) => `${campo} = ?`).join(" AND ");
  const valores = campos.map((campo) => filtro[campo]);

  const select = agendamentosDB.prepare(
    `SELECT * FROM agendamentos WHERE ${where}`,
  );

  return select.all(...valores);
}

function updateAgendamentos(id, agendamento) {
  const campos = Object.keys(agendamento);

  if (campos.length === 0) return;

  const setClause = campos.map((campo) => `${campo} = ?`).join(", ");
  const valores = campos.map((campo) => agendamento[campo]);

  const update = agendamentosDB.prepare(
    `UPDATE agendamentos SET ${setClause} WHERE id = ?`,
  );

  update.run(...valores, id);
}

module.exports = { setAgendamentos, getAgendamentos, updateAgendamentos };
