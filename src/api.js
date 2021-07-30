const BaseUrl = "http://localhost:3000";

export const createScheduleRequest = async (payload) => {
  try {
    let res = await fetch(`${BaseUrl}/user/me/schedule`, {
      // Adding method type
      method: "POST",

      // Adding body o r contents to send
      body: JSON.stringify(payload),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);
    if (res.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getScheduleRequest = async (id) => {
  try {
    let res = await fetch(`${BaseUrl}/user/me/schedule/${id}`, {
      // Adding method type
      method: "GET",
      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => data);
    if (res.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
};

export const removeScheduleRequest = async (id) => {
  try {
    let res = await fetch(`${BaseUrl}/user/me/schedule/${id}`, {
      // Adding method type
      method: "DELETE",
      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => data);
    if (res.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateScheduleRequest = async (id, payload) => {
  try {
    let res = await fetch(`${BaseUrl}/user/me/schedule/${id}`, {
      // Adding method type
      method: "PUT",
      body: JSON.stringify(payload),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => data);
    if (res.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
};
