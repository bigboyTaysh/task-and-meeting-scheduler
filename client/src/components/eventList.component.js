import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/pl";
import $ from "jquery";

export default class EventList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      events: this.props.events,
      removestatus: "",
      format: this.props.format,
      completed: this.props.completed,
    };
  }

  handleChangeState(id, completed) {
    var array = this.state.events;

    axios
      .put("" + process.env.REACT_APP_API + "/events/changeState", {
        id: id,
        completed: !completed,
      })
      .then((res) => {
        array
          .filter((x) => x._id === id)
          .map((x) => {
            if (x._id === id) {
              x.completed = !completed;
            }
          });

        if (this.state.completed || this.state.completed === undefined) {
          this.setState({
            events: array,
          });
        } else {
          this.setState({
            events: array.filter((x) => x.completed === this.state.completed),
          });
        }
      })
      .catch((error) => {
        this.setState({
          removestatus: error.date,
        });
      });
  }

  details(id) {
    this.props.history.push("/details/" + id);
  }

  componentWillReceiveProps(props) {
    this.setState({
      events: props.events,
      completed: props.completed,
    });
  }

  onClick(event, description) {
    if (
      description !== "" &&
      $(event.currentTarget).closest("tr").next("tr").is(":hidden")
    ) {
      $(event.currentTarget)
        .closest("tr")
        .next("tr")
        .show();
    } else if (
      description !== "" &&
      $(event.currentTarget).closest("tr").next("tr").is(":visible")
    ) {
      $(event.currentTarget)
        .closest("tr")
        .next("tr")
        .hide();
    }
  }

  closePopup(event, description) {
    if (description !== "") {
      $(event.currentTarget).next("tr").css("visibility", "hidden");
    }
  }

  handleDelete(id) {
    axios
      .delete("" + process.env.REACT_APP_API + "/events/delete", {
        data: {
          id: id,
        },
      })
      .then((res) => {
        var array = this.state.events;

        array.splice(
          array.findIndex((x) => x._id === id),
          1
        );
        this.setState({ events: array });
      })
      .catch((error) => {
        this.setState({
          removestatus: error.date,
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.events.length === 0 ? (
          <div>Brak zadań</div>
        ) : (
          <div className="searchTable">
            <table className="table table-borderless">
              {this.state.events.map((item, id) => (
                <tbody className="tbodyUp">
                  <tr key={id}>
                    <td>
                      {item.completed ? (
                        <button
                          className="none"
                          onClick={() => {
                            this.handleChangeState(item._id, item.completed);
                          }}
                        >
                          <i className="fa fa-check"></i>
                        </button>
                      ) : (
                        <button
                          className="none"
                          onClick={() => {
                            this.handleChangeState(item._id, item.completed);
                          }}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      )}
                    </td>
                    <td
                      onClick={(e) => {
                        this.onClick(e, item.description);
                      }}
                    >
                      {item.title}
                    </td>
                    <td
                      onClick={(e) => {
                        this.onClick(e, item.description);
                      }}
                    >
                      {moment(item.date).locale("pl").format(this.state.format)}
                    </td>
                    <td
                      onClick={(e) => {
                        this.onClick(e, item.description);
                      }}
                    >
                      {item.type.name}
                    </td>
                    <td>
                      <button
                        className="none"
                        onClick={() => {
                          this.details(item._id);
                        }}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                    </td>
                    <td>
                      <button
                        className="none"
                        onClick={() => {
                          this.handleDelete(item._id);
                        }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr style={{ display: "none" }}>
                    <td className="tbodyDown" colspan={5}>
                      {item.description === ""
                        ? "Brak opisu"
                        : item.description}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        )}
      </React.Fragment>
    );
  }
}
