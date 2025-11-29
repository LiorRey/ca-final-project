import * as listService from "../services/list-service.js";

export async function createList(req, res) {
  try {
    const list = await listService.createList(req.body);
    res.status(201).json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getListById(req, res) {
  try {
    const list = await listService.getListById(req.params.id);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    res.status(200).json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getListsByBoardId(req, res) {
  try {
    const { boardId } = req.query;
    if (!boardId) {
      return res
        .status(400)
        .json({ error: "boardId query parameter is required" });
    }
    const lists = await listService.getListsByBoardId(boardId);
    res.status(200).json({ lists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateList(req, res) {
  try {
    const list = await listService.updateList(req.params.id, req.body);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    res.status(200).json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function moveList(req, res) {
  try {
    const list = await listService.moveList(req.params.id, req.body.position);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    res.status(200).json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function archiveList(req, res) {
  try {
    const list = await listService.archiveList(req.params.id);
    if (!list) {
      return res.status(204).send();
    }
    res.status(200).json({ list });
  } catch (err) {
    console.error(err);
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteList(req, res) {
  try {
    const list = await listService.deleteList(req.params.id);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    res.status(200).json({ id: list._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
