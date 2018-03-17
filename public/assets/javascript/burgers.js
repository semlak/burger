'use strict';


let burgerLItemplateScript = null;
let burgerLItemplate = null;
$.ajax({
  url: "/assets/templates/partials/burgers/burger-block.hbs",
  method: "GET"
}).done(data => {
  // console.log("data", data);
  burgerLItemplateScript = data;
  burgerLItemplate = Handlebars.compile(burgerLItemplateScript);

})

const coerceToBool = p => {
  // console.log("typeof p", typeof p)
  switch (typeof p) {
    case "boolean" : return p;
    case "number" : return (p === 1 ? true : false);
    case "string" : return (p === "true" || p === "1");
    default : return (p == true);
  }
}

$(document).ready(() => {
  let devourItem = burgerId => {
    // console.log("in devourItem with id", burgerId);
    const newDevouredState = {
      devoured: true
    };

    // Send the PUT request.
    $.ajax("/api/burger/" + burgerId, {
      type: "PUT",
      data: newDevouredState
    }).then(() => {
      let $devouredItem = $("li#burger-" + burgerId);
      $devouredItem.remove().find(".draggable-indicator").remove();
      let $faElement = $devouredItem.find("i")
      $faElement.removeClass("devour fa-utensils").addClass("delete fa-times")
      $devouredItem.appendTo($("ul#devoured-items"))
    })
  }

  let modalError = errorMessage => {
        let element = $("<div>")
        // .append($("<h5>").text("Error"))
        .append($("<p>").text(errorMessage));
        $("#error-modal .modal-body").empty().append(element);
        $("#error-modal").modal("show")
  }

  // Make sure we wait to attach our handlers until the DOM is fully loaded.
  $(document).ready(() =>  {

  // })
  // $(() => {
    $(document).on("click", ".change-item.devour", (e) => {
      const burgerId = $(e.currentTarget).data("id");
      const newDevoured = $(e.currentTarget).data("newdevoured");
      // console.log("hey, trying to update, id", burgerId, ", newDevoured", newDevoured )

      devourItem(burgerId);
    });

    $(".create-form").on("submit", (event) => {
      // Make sure to preventDefault on a submit event.
      event.preventDefault();

      const newburger = {
        burger_name: $("#burger-name").val().trim(),
        devoured: coerceToBool($("[name=devoured]:checked").val().trim())
      };
      if (!newburger.burger_name || newburger.burger_name.length < 1 ) {
        console.log("need to put a burger name")
        // return alert("need to put a burger name");
        return modalError("Please input something for a burger name!")
      }
      // console.log("newburger " , newburger);

      $("#burger-name").val("");
      // Send the POST request.
      $.ajax("/api/burger", {
        type: "POST",
        data: newburger
      }).then(
        (res) => {
          // console.log("created new burger", res);
          // rather than reload page, generate new item using client side template if available
          newburger.id = res.id;
          if (burgerLItemplate) {
            $("ul#" + (newburger.devoured ? "devoured-items" : "available-items"))
              .append($(burgerLItemplate(newburger)));
          }
          else {
            location.reload();
          }
        }
      );
    });


    $(document).on("click", ".change-item.delete", (e) => {
      let burgerId = $(e.currentTarget).data("id");
      e.preventDefault();
      $.ajax({
        url: "/api/burger/" + burgerId,
        method: "DELETE"
      }).done(res => {
        let selectorOfElementToRemove = "li#burger-" + burgerId
        $("li#burger-" + burgerId).toggle();
      })
    })


    // sortable jquery lists (for item dragging from avaiable to devoured menu)
    let adjustment = null;
    $("ul.simple_with_animation").sortable({
      group: 'simple_with_animation',
      pullPlaceholder: false,
      // animation on drop
      onDrop: function  ($item, container, _super) {
        let $clonedItem = $('<li/>').css({height: 0});
        $item.before($clonedItem);
          $clonedItem.detach();
          _super($item, container);

        let burgerId = $item.attr("id").replace(/burger-(\d{1,})/, "$1");
        let destinationContainer = container.target.attr("id");
        if (destinationContainer === "devoured-items") {
          devourItem(burgerId);
        }
      },

      // set $item relative to cursor position
      onDragStart: ($item, container, _super) => {
        let offset = $item.offset(),
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

      onDrag: ($item, position) => {
        $item.css({
          left: position.left - adjustment.left,
          top: position.top - adjustment.top,
        });
      },

      isValidTarget: ($item, container) => {
        return container.target.attr("id") === "devoured-items";
      },
      exclude: 'ul#devoured-items li',
      tolerance: 100
    });

    // $("ul#available-items").sortable({
    //   group: "simple_with_animation",
    //   drop: true,
    //   drag: true,
    // })

    // $("ul#devoured-items").sortable({
    //   group: "simple_with_animation",
    //   drop: false,
    //   drag: false,
    // })
  });
})
