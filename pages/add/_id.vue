<template>
  <div>
    <BaseHero 
      :title="'Add New '+ $route.params.id" 
      subtitle="based on defaults"/>
    <section class="section has-background-light">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h2 class="title">Add {{ $route.params.id }}</h2>
            <b-field label="Permalink/id">
              <b-input 
                v-model="document.id" 
                type="text" 
                placeholder="e.g. this-is-a-permalink"/>
            </b-field>
            <b-field 
              v-for="(item, index) in data" 
              :label="item.name" 
              :key="index">
              <!-- Text-->
              <b-field v-if="item.type == 'text'">
                <b-input v-model="document[item.name]"/>
              </b-field>
              <!-- number-->
              <b-field v-if="item.type == 'number'">
                <b-input 
                  v-model="document[item.name]" 
                  type="number"/>
              </b-field>
              <!-- Textarea-->
              <b-field v-if="item.type == 'textarea'">
                <b-input 
                  v-model="document[item.name]" 
                  type="textarea"/>
              </b-field>
              <!-- md-text-->
              <div v-if="item.type == 'markdown'">
                <no-ssr>
                  <markdown-editor 
                    ref="markdownEditor" 
                    v-model="document[item.name]"/>
                </no-ssr>
              </div>
              <!-- Topics -->
              <b-field v-if="item.type == 'array'">
                <b-taginput
                  v-model="document[item.name]"
                  ellipsis
                  icon="label"
                  placeholder="Add an option"
                />
              </b-field>
              <!-- Date-->
              <b-field v-if="item.type == 'date'">
                <b-datepicker
                  v-model="document[item.name]"
                  :first-day-of-week="1"
                  placeholder="Click to select..."
                >
                  <button 
                    class="button is-primary" 
                    @click="date = new Date()">
                    <b-icon icon="calendar-today"/>
                    <span>Today</span>
                  </button>
                  
                  <button 
                    class="button is-danger" 
                    @click="date = null">
                    <b-icon icon="close"/>
                    <span>Clear</span>
                  </button>
                </b-datepicker>
              </b-field>
              <!-- Image-->
              <div v-if="item.type == 'image'">
                <input
                  id="files"
                  ref="uploadInput"
                  :multiple="false"
                  type="file"
                  name="file"
                  accept="image/*"
                  @change="detectFiles($event)"
                >
                <progress
                  v-if="uploading && !uploadEnd"
                  :value="progressUpload"
                >{{ progressUpload }}%</progress>
                <img 
                  v-if="uploadEnd" 
                  :src="downloadURL" 
                  width="100%">
                <div v-if="uploadEnd">
                  <button 
                    class="button" 
                    @click="deleteImage()">Delete</button>
                </div>
                <b-field label="Source URL">
                  <b-input 
                    v-model="document[item.name]" 
                    type="text"/>
                </b-field>
              </div>

              <!-- Radio -->
              <b-field v-if="item.type == 'radio'">
                <b-switch
                  :value="false"
                  v-model="document[item.name]"
                  type="is-info"
                  true-value="Yes"
                  false-value="No"
                >{{ document[item.name] }}</b-switch>
              </b-field>
             

              <!-- symptom -->
              <b-field v-if="item.type == 'symptom'">
                <b-field>
                  <b-autocomplete
                    v-model="selected[item.name]"
                    :data="symptom"
                    :open-on-focus="openOnFocus"
                    :keep-first="keepFirst"
                    placeholder="e.g. Müdigkeit"
                    field="symptomName"
                    @select="option => document[item.name] = option"
                  />
                </b-field>
              </b-field>

              <!-- wirkstoff -->
              <b-field v-if="item.type == 'wirkstoff'">
                <b-field>
                  <b-autocomplete
                    v-model="selected[item.name]"
                    :data="wirkstoff"
                    :open-on-focus="openOnFocus"
                    :keep-first="keepFirst"
                    placeholder="e.g. Zink"
                    field="wirkstoffName"
                    @select="option => document[item.name] = option"
                  />
                </b-field>
              </b-field>

              <!-- prozess -->
              <b-field v-if="item.type == 'prozess'">
                <b-field>
                  <b-autocomplete
                    v-model="selected[item.name]"
                    :data="wirkstoff"
                    :open-on-focus="openOnFocus"
                    :keep-first="keepFirst"
                    placeholder="e.g. Zellstoffwechsel"
                    field="prozessName"
                    @select="option => document[item.name] = option"
                  />
                </b-field>
              </b-field>

              <!-- Author -->
              <b-field v-if="item.type == 'author'">
                <b-field>
                  <b-autocomplete
                    v-model="selected[item.name]"
                    :data="author"
                    :open-on-focus="openOnFocus"
                    :keep-first="keepFirst"
                    placeholder="e.g. Anne"
                    field="autorName"
                    @select="option => document[item.name] = option"
                  />
                </b-field>
              </b-field>

              <!-- typ -->
              <b-field v-if="item.type == 'wirkstofftyp'">
                <b-field>
                  <b-autocomplete
                    v-model="selected[item.name]"
                    :data="wirkstofftyp"
                    :open-on-focus="openOnFocus"
                    :keep-first="keepFirst"
                    placeholder="e.g. Vitamin"
                    field="wirkstofftypName"
                    @select="option => document[item.name] = option"
                  />
                </b-field>
              </b-field>
            </b-field>

            <br>
            <button
              :disabled="writeCarSuccessful"
              class="button is-success is-fullwidth"
              @click="writeCarToFirestore"
            >
              <span v-if="!writeCarSuccessful">Store</span>
              <span v-else>Successful!</span>
            </button>
          </div>

          <div class="column">
            <div v-if="$route.params.id == 'symptom'">
             
              <div class="toggle">
                <h2 class="title">Wirkstoffe</h2>
                <ul>
                  <li 
                    v-for="item in stoffe" 
                    :key="item.id">
                    <b-field label="Wirkstoff">
                      <b-autocomplete
                        :data="wirkstoff"
                        :open-on-focus="openOnFocus"
                        :keep-first="keepFirst"
                        placeholder="e.g. Zink"
                        field="wirkstoffName"
                        @select="option => item.wirkstoff = option"
                      />
                    </b-field>
                    <b-field label="Empfehlung">
                      <no-ssr>
                        <markdown-editor 
                          ref="markdownEditor" 
                          v-model="item.empfehlung"/>
                      </no-ssr>
                    </b-field>
                    <b-field label="Kurzinfo">
                      <no-ssr>
                        <markdown-editor 
                          ref="markdownEditor" 
                          v-model="item.content"/>
                      </no-ssr>
                    </b-field>
                    <b-field label="wirkungsgrad">
                      <b-select 
                        v-model="item.wirkungsgrad" 
                        placeholder="Select">
                        <option value="primary">Primär</option>
                        <option value="secondary">Sekundär</option>
                        <option value="optional">Optional</option>
                      </b-select>
                    </b-field>
                    <button 
                      class="button" 
                      @click="deleteWirkstoff(index)">delete wirkstoff</button>
                  </li>
                </ul>
                <b-field grouped>
                  <button 
                    class="button" 
                    @click="addWirkstoff()">+ wirkstoff</button>
                </b-field>
              </div>

              <hr>


              <h2 class="title">FAQ</h2>
              <ul 
                v-if="faq.length > 0" 
                class="box">
                <li 
                  v-for="(item, index) in faq" 
                  :key="index">
                  <b-field label="title">
                    <b-input v-model="item.title"/>
                  </b-field>
                  <no-ssr>
                    <markdown-editor 
                      ref="markdownEditor" 
                      v-model="item.content"/>
                  </no-ssr>
                  <button 
                    class="button" 
                    @click="deleteFAQ(index)">delete faq item</button>
                </li>
              </ul>
              <button 
                class="button" 
                @click="addFAQ">add faq item</button>
            </div>

            <hr>

            <h2 class="title">Blocks</h2>
            <ul class>
              <li 
                v-for="(block, index) in blocks" 
                :key="index" 
                class="box">
                <div v-if="block.type == 'text'">
                  <h3 class="title is-5">
                    Paragraph
                    <button 
                      class="delete" 
                      @click="deleteBlock(index)">x</button>
                  </h3>
                  <label>Text</label>
                  <no-ssr>
                    <markdown-editor 
                      ref="markdownEditor" 
                      v-model="block.content"/>
                  </no-ssr>
                  <hr>
                </div>
                <div v-if="block.type == 'image'">
                  <h3 class="title is-5">
                    Image
                    <button 
                      class="delete" 
                      @click="deleteBlock(index)">x</button>
                  </h3>
                  <div>
                    <button 
                      v-if="!uploadEnd && !uploading" 
                      @click="selectFile">Upload an image</button>
                    <input
                      id="files"
                      ref="uploadInput"
                      :multiple="false"
                      type="file"
                      name="file"
                      accept="image/*"
                      @change="detectFiles($event)"
                    >
                    <progress
                      v-if="uploading && !uploadEnd"
                      :value="progressUpload"
                    >{{ progressUpload }}%</progress>
                    <img 
                      v-if="uploadEnd" 
                      :src="downloadURL" 
                      width="100%">
                    <div v-if="uploadEnd">
                      <button 
                        class="button" 
                        @click="deleteImage()">Delete</button>
                    </div>
                  </div>
                  <label>Source</label>
                  <input 
                    v-model="block.src" 
                    type="text" 
                    class="input">
                  <label>Caption</label>
                  <input 
                    v-model="block.caption" 
                    type="text" 
                    class="input">
                  <hr>
                </div>
              </li>
            </ul>
            <hr>
            <b-field grouped>
              <button 
                class="button" 
                @click="addBlock()">Add new Text</button>
              <button 
                class="button" 
                @click="addImage()">Add new Image</button>
            </b-field>
          </div>
        </div>
        
      </div>
    </section>
  </div>
</template>

<script>
import { fireDb } from '~/plugins/firebase.js'
import { storage } from '~/plugins/firebase.js'
import firebase from 'firebase/app'

export default {
  data() {
    return {
      faq: [],
      document: {},
      id: '',
      data: [],
      blocks: [],
      author: [],
      stoffe: [],
      wirkstoff: [],
      symptom: [],
      wirkstofftyp: [],
      prozess: [],
      name: '',
      date: new Date(),
      selected: [],
      //upload image
      oldImgUrl: '',
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      //cars
      writeCarSuccessful: false,
      //buefy
      keepFirst: false,
      openOnFocus: true
    }
  },
  layout: 'admin',
  computed: {
    filteredAuthors() {
      return this.authors.filter(option => {
        return (
          option.autorName
            .toString()
            .toLowerCase()
            .indexOf(this.name.toLowerCase()) >= 0
        )
      })
    },
    filteredDataObj() {
      return this.cars.filter(option => {
        return (
          option.carName
            .toString()
            .toLowerCase()
            .indexOf(this.name.toLowerCase()) >= 0
        )
      })
    }
  },
  watch: {
    uploadTask: function() {
      this.uploadTask.on(
        'state_changed',
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          )
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.uploadEnd = true
            this.downloadURL = downloadURL
          })
        }
      )
    }
  },
  methods: {
    getFilteredAuthors(text) {
      var authors = this.authors.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        )
      })
    },
    getFilteredTopics(text) {
      var topics = this.topics.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        )
      })
    },
    deleteBlock: function(index) {
      this.blocks.splice(index, 1)
    },
    deleteFAQ: function(index) {
      this.faq.splice(index, 1)
    },
    deleteWirkstoff: function(index) {
      this.stoffe.splice(index, 1)
    },
    addBlock() {
      this.blocks.push({
        content: '',
        type: 'text',
        id: this.idcounter++
      })
    },
    addFAQ() {
      this.faq.push({
        title: '',
        text: ''
      })
    },
    addWirkstoff() {
      this.stoffe.push({
        content: ''
      })
    },
    addImage() {
      this.blocks.push({ content: 'new block', type: 'image' })
    },
    setImageSource: function(index) {
      this.blocks[index].src = downloadURL
    },
    //upload image
    selectFile() {
      this.$refs.uploadInput.click()
    },
    detectFiles(e) {
      let fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
    },
    upload(file) {
      this.fileName = file.name
      this.uploading = true
      var baseDir = this.$route.params.id
      var extDir = this.document.id
      this.uploadTask = storage
        .ref(`${baseDir}/${extDir}/${file.name}`)
        .put(file)
    },
    deleteImage() {
      if (this.oldImgUrl === '') {
        this.deleteImgOnFirebase()
      } else {
        this.deleteImgOnUpdate()
      }
    },
    setCoverImgOnUpdate() {
      this.uploadEnd = true
      this.downloadURL = this.oldImgUrl
    },
    deleteImgOnFirebase() {
      var baseDir = this.$route.params.id
      var extDir = this.document.id
      storage
        .ref(`${baseDir}/${extDir}/${this.fileName}`)
        .delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          console.log('deleted')
        })
        .catch(error => {
          console.error(`file delete error occured: ${error}`)
        })
    },
    deleteImgOnUpdate() {
      this.uploading = false
      this.uploadEnd = false
      this.downloadURL = ''
    },
    async writeCarToFirestore() {
      if (this.blocks.length > 0) {
        var timeToRead = await Math.round(
          JSON.stringify(this.blocks).split(' ').length / 200
        )
        this.document.timeToRead = timeToRead
      }

      if ((this.$route.params.id = 'symptom')) {
        const stoffe = this.stoffe
        const docInfo = {}
        docInfo.id = this.document.id
        docInfo.name = this.document.symptomName
        docInfo.content = this.document.symptomKurzInfo
        stoffe.forEach(function(item) {
          fireDb
            .collection('wirkstoff')
            .doc(item.wirkstoff.id)
            .update({
              mentions: firebase.firestore.FieldValue.arrayUnion(docInfo)
            })
        })
      }

      const ref = fireDb.collection(this.$route.params.id).doc(this.document.id)

      const document = {
        data: this.document,
        blocks: this.blocks,
        wirkstoffe: this.stoffe,
        faq: this.faq
      }

      try {
        await ref.set(document)
      } catch (e) {
        // TODO: error handling
        console.error(e)
      }
      this.writeSuccessful = true
    }
  },
  async asyncData({ params }) {
    let def = await fireDb
      .collection('defaults')
      .doc(params.id)
      .get()

    let authorCollection = []
    let authors = await fireDb
      .collection('autor')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          authorCollection.push(doc.data().data)
        })
      })

    let symptomCollection = []
    let symptom = await fireDb
      .collection('symptom')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          symptomCollection.push(doc.data().data)
        })
      })

    let wirkstoffCollection = []
    let wirkstoff = await fireDb
      .collection('wirkstoff')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          wirkstoffCollection.push(doc.data().data)
        })
      })

    let prozessCollection = []
    let prozess = await fireDb
      .collection('prozess')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          prozessCollection.push(doc.data().data)
        })
      })

    let wirkstofftypCollection = []
    let wirkstofftyp = await fireDb
      .collection('wirkstofftyp')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          wirkstofftypCollection.push(doc.data().data)
        })
      })

    if (def.data()) {
      return {
        data: def.data().defaults,
        author: authorCollection,
        symptom: symptomCollection,
        wirkstoff: wirkstoffCollection,
        prozess: prozessCollection,
        wirkstofftyp: wirkstofftypCollection
      }
    } else {
      return {
        data: [],
        author: authorCollection,
        symptoms: symptomCollection,
        wirkstoff: wirkstoffCollection,
        prozess: prozessCollection,
        wirkstofftyp: wirkstofftypCollection
      }
    }
  }
}
</script>
