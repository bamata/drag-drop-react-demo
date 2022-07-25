import { Component } from "react";
import { Alert, AlertTitle, Collapse } from "@mui/material";

export default class AppDragDropDemo extends Component {
    state = {
        open: false,
        tasks: [
            {
                name: "Learn Angular",
                category: "wip",
                bgcolor: "yellow"
            },
            {
                name: "Learn React",
                category: "wip",
                bgcolor: "yellow"
            },
            {
                name: "Learn Vue",
                category: "complete",
                bgcolor: "skyblue"
            }
        ],
        imcompleteTasks: [],
        completedTasks: []
    }
    bgcolor = {
        complete: "skyblue",
        wip: "yellow"

    }
    componentDidMount() {
        this.setState({
            imcompleteTasks: this.state.tasks.
            filter(task => task.category === "wip"),

            completedTasks: this.state.tasks.
            filter(task => task.category === "complete")
        })
       
    }

    handleOnDragStart = (e, id) => {
        //console.log("dragstart", id);
        e.dataTransfer.setData("text/plain", id);
    }

    handleOnDragOver = (e) => {
        e.preventDefault();
       
    }

    handleOnDrop = (e, cat) => { 
       const id = e.dataTransfer.getData("text");

       const tasks = [...this.state.tasks];
       const indexOf = tasks.indexOf(tasks.find(t => t.name === id))
       const task = {...tasks.find(t => t.name === id)};
       task.category = cat;
       tasks[indexOf] = task;
        
    
        // If movedTask is complete or wip
        if(task.category === "complete") {
            const foundTask = this.state.completedTasks.find(t => t.name === task.name);
            task.bgcolor = this.bgcolor.complete;
            if(!foundTask) {
               
                this.setState({
                    completedTasks: this.state.completedTasks.concat(task),
                    imcompleteTasks: this.state.imcompleteTasks.filter(
                        (t) => t.name !== task.name,
                    )
                })
              
            }
            // Showing the message
            this.setState({open: true})

            // Hidding the message
            setTimeout(() => {
                this.setState({open: false})
            }, 5000)
        } else {
            const foundTask = this.state.imcompleteTasks.find(t => t.name === task.name);
            task.bgcolor = this.bgcolor.wip;
            if(!foundTask) {
                this.setState({
                    imcompleteTasks: this.state.imcompleteTasks.concat(task),
                    completedTasks: this.state.completedTasks.filter(
                        (t) => t.name !== task.name,
                    )
                })
            }
        }

       
    }
    showSuccessfullMessage = (msg) => {
        // 
        return(
            <Collapse in={this.state.open}>
                <Alert severity="success"  sx={{
                    width: 530,
                   /* display: `${ this.state.open ? "flex" : "none"}` */
                }}>
                <AlertTitle>Success</AlertTitle>
                <strong>{msg}</strong>  was successfully completed!
            </Alert>    
            </Collapse>
        );
    }

    render() {
        return(
           <div className="main-container">
             <header className="App-header">
                <h1>DRAG & DROP DEMO</h1>
            </header>
            <div className="msg-container">
                {
                    this.showSuccessfullMessage(
                        this.state.completedTasks[this.state.completedTasks.length - 1]?.name
                    )
                }
            </div>
            <div className="container">
            
                <div className="container-drag" 
                    onDrop={(e) => this.handleOnDrop(e, "wip")}
                    onDragOver={(e) => this.handleOnDragOver(e)}>
                    <div className="title">
                        <label>TASKS</label>
                    </div>
                    <div className="tasks-container">
                        {
                            this.state.imcompleteTasks.map(task => {
                                return ( 
                                    <div key={task.name}
                                        onDragStart={ (e) => { this.handleOnDragStart(e, task.name) } }
                                        draggable
                                        className="draggable"
                                        style={{backgroundColor: task.bgcolor}}
                                        >
                                     { task.name }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="droppable" 
                    onDragOver={(e) => this.handleOnDragOver(e)}
                    onDrop={(e) => this.handleOnDrop(e, "complete")}
                    >
                    <div className="title">
                        <label>COMPLETED</label>
                        
                    </div>
                    <div className="complete-tasks-container">
                        {
                           this.state.completedTasks.map(task => {
                            return (
                                <div key={task.name}
                                    onDragStart={ (e) => { this.handleOnDragStart(e, task.name) } }
                                    draggable
                                    className="draggable"
                                    style={{backgroundColor: task.bgcolor}}
                                    >
                                        { task.name }
                                    </div>
                                )
                           })
                        }
                    </div>
                </div>
            </div>
           </div>
        )
    }
}