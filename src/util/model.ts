import remote from "../remote";

let postToArModel = async (str: string) => {
  let res = "";
  const body = {
    content: str,
  };
  try {
    let data = (await remote.post("/model/ar", body)).data;
    res = data.result[0].generated_text;
    return res;
  } catch (e: any) {
    return Promise.reject("failed to post to arabic summarizer model");
  }
};

let postToBartModel = async (str: string, isShort: boolean) => {
  let res = "";
  const body = {
    isShort,
    content: str,
  };
  try {
    let data = (await remote.post("/model/en", body)).data;
    res = data.result.summary_text;
    return res;
  } catch (e) {
    return Promise.reject("failed to post to summarizer model");
  }
};

let postToEnArModel = async (str: string) => {
  let res = "";

  const body = {
    content: str,
  };
  try {
    let { data } = await remote.post("/model/enar", body);
    res = data.result.translation_text;
    return res;
  } catch (e: any) {
    return Promise.reject("failed to post to translator model");
  }
};

let postToLdModel = async (inputs: string) => {
  let res = "";

  const body = {
    inputs: inputs,
  };
  try {
    let data: ModelResponse = (await remote.post("/model/ld", body)).data;
    res = data.result;
    return res;
  } catch (e: any) {
    return Promise.reject("failed to post to language detection model");
  }
};

let postToKeModel = async (inputs: string) => {
  const body = {
    inputs: inputs,
  };
  try {
    let data: KeModelResponse = (await remote.post("/model/ke", body)).data;
    const res = data.result;
    return res;
  } catch (e: any) {
    return Promise.reject("failed to post to Keyword Extraction model");
  }
};

let postToSmAEModel = async (inputs: string) => {
  const body = {
    inputs: inputs,
  };
  try {
    let data: SummaryResponse = (await remote.post("/model/smae")).data;
    const res = data.result.summary_text;
    return res;
  } catch (e: any) {
    return Promise.reject(
      "failed to post to Arabic/English Summarization model"
    );
  }
};

interface SummaryResponse {
  result: Summary;
}

interface Summary {
  summary_text: string;
}

interface ModelResponse {
  result: string;
}

interface KeModelResponse {
  result: Array<Keyword>;
}

interface Keyword {
  entity_group: string;
  score: number;
  word: string;
  start: number;
  end: number;
}

export type { Keyword };

export {
  postToArModel,
  postToBartModel,
  postToEnArModel,
  postToLdModel,
  postToKeModel,
  postToSmAEModel,
};
