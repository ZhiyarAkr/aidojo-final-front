import remote from "../remote";

const postText = async (text: string) => {
  let trimmed = text.trim();
  if (trimmed === "") {
    return;
  }
  try {
    let body = {
      text: trimmed,
    };
    let r = (await remote.post("/text/", body)).data;
  } catch (e) {
    return Promise.reject("failed to save text");
  }
};

const fetchAllTexts = async () => {
  try {
    let res: TextResponse = (await remote.get("/text/")).data;
    return res.texts;
  } catch (e) {
    return Promise.reject("failed to fetch texts");
  }
};

const deleteText = async (id: number) => {
  try {
    let res = (await remote.delete(`/text/${id}`)).data;
  } catch (e) {
    return Promise.reject("failed to delete text");
  }
};

interface TextResponse {
  texts: Array<Text>;
}

interface Text {
  id: number;
  text: string;
  date: number;
}

export type { Text };
export { postText, fetchAllTexts, deleteText };
