'use strict';

// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(document).ready(() =>  {

// })
// $(() => {
  $(".change-devoured").on("click", (e) => {
    const id = $(e.currentTarget).data("id");
    const newDevoured = $(e.currentTarget).data("newdevoured");
    console.log("hey, trying to update, id", id, ", newDevoured", newDevoured )

    const newDevouredState = {
      devoured: newDevoured
    };

    // Send the PUT request.
    $.ajax("/api/burger/" + id, {
      type: "PUT",
      data: newDevouredState
    }).then(
      () => {
        console.log("changed devoured to", newDevoured);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  $(".create-form").on("submit", (event) => {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    const newburger = {
      burger_name: $("#burger-name").val().trim(),
      devoured: $("[name=devoured]:checked").val().trim()
    };
    console.log("newburger " , newburger)

    // Send the POST request.
    $.ajax("/api/burger", {
      type: "POST",
      data: newburger
    }).then(
      () => {
        console.log("created new burger");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });


  $(".delete").on("click", (e) => {
    e.preventDefault();
    let id = $(e.currentTarget).data("id");

    console.log($(e.currentTarget).data("id"))
    $.ajax({
      url: "/api/burger/" + id,
      method: "DELETE"
    }).done(res => {
      // console.log(res);
      // $("li#" + id).remove();
      $("tr#" + id).remove();
    })
  })
});
