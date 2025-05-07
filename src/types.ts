export interface XMindTopic {
  id:        string;
  title:     string;
  rootTopic: Topic;
}

export interface Topic {
  id:       string;
  title:    string;
  children?: TopicChildren;
}

interface TopicChildren {
  attached: Topic[];
}
