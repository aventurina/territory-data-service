import orderBy from 'lodash/orderBy';
import get from 'lodash/get';
import { conn } from '../server';
import axios from 'axios';

class GroupAsync {
  async get (id, congId, code) {
    if (!(id || (congId && code))) throw new Error('group id or congId and group code required');

    let sql;
    if (id) {
      sql = `SELECT * FROM groups WHERE id=${id}`;
    } else {
      `SELECT * FROM groups WHERE congregation_id=${congId} AND code='${code}'`;
    }
    const result = await conn.query(sql);
    return result && result.length && result[0];
  }
  async getGroups (congId) {
    if (!congId) throw new Error('congregation id required');
    return await conn.query(`SELECT code FROM groups WHERE congregation_id=${congId}`);
  }

  async create (group) {
    if (!group.code) {
      throw new Error('group code is required');
    }
    if (!group.congregation_id) {
      throw new Error('cong id is required');
    }

    const results = await conn.query(`INSERT INTO groups (
      congregation_id,
      code,
      description,
      overseer
    ) VALUES (
      ${ get(group, 'congregation_id', '') },
      '${ get(group, 'code', '') }',
      '${ get(group, 'description', '') }',
      ${ get(group, 'overseer', '') }
    )`);

    return results.insertId;
  }

  async update (group) {
    if (!group.id) {
      throw new Error('group id is required');
    }
    if (!group.code) {
      throw new Error('group code is required');
    }
    if (!group.congregation_id) {
      throw new Error('cong id is required');
    }

    const sql = `UPDATE groups SET
      congregation_id = ${get(group, 'congregation_id', '')},
      code = '${get(group, 'code', '')}',
      description = '${get(group, 'description', '')}',
      overseer = ${get(group, 'overseer', '')}
    WHERE id = ${get(group, 'id', '')}`;

    await conn.query(sql);
  }
}

export default new GroupAsync();
