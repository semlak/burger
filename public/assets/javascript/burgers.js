'use strict';

let devourItem = id => {
  console.log("in devourItem with id", id);
  const newDevouredState = {
    devoured: true
  };

  // Send the PUT request.
  $.ajax("/api/burger/" + id, {
    type: "PUT",
    data: newDevouredState
  }).then(
    () => {
      console.log("changed devoured to", true);
      // Reload the page to get the updated list
      location.reload();
    }
  );
}

// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(document).ready(() =>  {

// })
// $(() => {
  $(".change-devoured").on("click", (e) => {
    const id = $(e.currentTarget).data("id");
    // const newDevoured = $(e.currentTarget).data("newdevoured");
    // console.log("hey, trying to update, id", id, ", newDevoured", newDevoured )

    devourItem(id);
    // const newDevouredState = {
    //   devoured: newDevoured
    // };
    //
    // // Send the PUT request.
    // $.ajax("/api/burger/" + id, {
    //   type: "PUT",
    //   data: newDevouredState
    // }).then(
    //   () => {
    //     console.log("changed devoured to", newDevoured);
    //     // Reload the page to get the updated list
    //     location.reload();
    //   }
    // );
  });

  $(".create-form").on("submit", (event) => {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    const newburger = {
      burger_name: $("#burger-name").val().trim(),
      devoured: $("[name=devoured]:checked").val().trim()
    };
    if (!newburger.burger_name || newburger.burger_name.length < 1 ) {
      console.log("need to put a burger name")
      return alert("need to put a burger name");
    }
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


  $(".delete-item").on("click", (e) => {
    let id = $(e.currentTarget).data("id");
    e.preventDefault();

    console.log($(e.currentTarget).data("id"))
    // return;

    $.ajax({
      url: "/api/burger/" + id,
      method: "DELETE"
    }).done(res => {
      // console.log(res);
      $("li#" + id).remove();
      // $("tr#" + id).remove();
    })
  })

  let adjustment = null;


  $("ul.simple_with_animation").sortable({
    group: 'simple_with_animation',
    pullPlaceholder: false,
    // animation on drop
    onDrop: function  ($item, container, _super) {
      var $clonedItem = $('<li/>').css({height: 0});
      $item.before($clonedItem);
      $clonedItem.animate({'height': $item.height()});

      $item.animate($clonedItem.position(), function  () {
        $clonedItem.detach();
        _super($item, container);
      });
      console.log("hey", container, "$item", $item);
      // devourItem
      let id = $item.attr("id");
      let destinationContainer = container.target.attr("id");
      if (destinationContainer === "devoured-items") {
        devourItem(id);
      }
      // console.log("id:", id);
      // console.log((container.target).attr("id"))

    },

    // set $item relative to cursor position
    onDragStart: ($item, container, _super) => {
      var offset = $item.offset(),
          pointer = container.rootGroup.pointer;

      adjustment = {
        left: pointer.left - offset.left,
        top: pointer.top - offset.top
      };
      $item.css({
        background: "black"
      })



      _super($item, container);
    },
    onDrag:  ($item, position) => {
      $item.css({
        left: position.left - adjustment.left,
        top: position.top - adjustment.top,
      });
    },
    isValidTarget: ($item, container) => {
      // return container.currentTarget.attr("id") === "available-items";
      // console.log(container);
      return container.target.attr("id") === "devoured-items";

      // return true;
    },
    exclude: 'ul#devoured-items li'
    // drop: false,
    // drag: false
    // drag:
    // drop: false
    // afterMove: ($placeholder, container, $closestContainer) => {
    //   console.log("$placeholder", $placeholder, "container", container, "$closestContainer", $closestContainer)
    // }
  });
  $("ul#available-items").sortable({
    group: "simple_with_animation",
    drop: false,
    drag: false,
  })

  $("ul#devoured-items").sortable({
    group: "simple_with_animation",
    drop: false,
    drag: false,
  })
});
