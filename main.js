const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'NGOC_PLAYER'
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist =$('.playlist')
var count = 0;
var arrayTemp = [];
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,  
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))|| {},
    songs:[
        {
            name: 'Dang Em',
            singer: 'Nguyen Phi Hung',
            path: './assets/music/dangem.mp3',
            image: './assets/img/ha1.jpg'
        },
        {
            name: 'Hello Viet Nam',
            singer: 'Pham Quynh Anh',
            path: './assets/music/hellovietnam.mp3',
            image: './assets/img/ha2.jpg'
        },
        {
            name: 'Dusk Till Dawn ',
            singer: 'ZAYN',
            path: './assets/music/dusktilldown.mp3',
            image: './assets/img/h3.jpg'
        },
        {
            name: 'Dancing With Your Ghost',
            singer: 'Sasha Alex Sloan',
            path: './assets/music/dancing.mp3',
            image: './assets/img/ha4.jpg'
        },
        {
            name: 'La la la ft. Sam Smith',
            singer: 'Naughty Boy',
            path: './assets/music/lalala.mp3',
            image: './assets/img/ha5.jpg'
        },
        {
            name: 'Remember when',
            singer: 'Alan Jackson',
            path: './assets/music/remember.mp3',
            image: './assets/img/ha6.jpg'
        },
        {
            name: 'Skin (Audio)',
            singer: 'Rag n Bone Man',
            path: './assets/music/skin.mp3',
            image: './assets/img/ha7.jpg'
        },
        {
            name: 'So Far Away ',
            singer: ' Martin Garrix ',
            path: './assets/music/sofaraway.mp3',
            image: './assets/img/ha8.jpg'
        },
        {
            name: 'Unstoppable ',
            singer: ' Si a ',
            path: './assets/music/unstopsible.mp3',
            image: './assets/img/ha9.jpg'
        },
        {
            name: 'Nevada ',
            singer: 'Vicetone ',
            path: './assets/music/nevada.mp3',
            image: './assets/img/ha10.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `  
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
             <div class="thumb" style="background-image: url('${song.image}')">
                </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handlerEvents: function() {
        const _this = this
        const cdWindow = cd.offsetWidth
        // xử lí CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 15000,
            iterations:Infinity
        })
        cdThumbAnimate.pause()
        // Xử lí thu nhỏ / phóng to CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWindow - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0
            cd.style.opacity = newCdWidth / cdWindow
        }
        // xử lí click play
        playBtn.onclick = function(){
           if(_this.isPlaying) {          
            audio.pause()
           } else {             
            audio.play()          
           }            
        }
        //  khi bai hat dc play 
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
           //  khi bai hat dc dung lai 
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }
        // khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if (audio.duration) {
                const progressPercent = Math.floor( audio.currentTime / audio.duration *100 )
                progress.value = progressPercent
            }
        }

        //  xu li khi tua bai hat 
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        //  khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
           _this.playRandomSong()
            }else{
            _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
         //  khi prev song
         prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
                 }else{
                 _this.prevSong()
                 }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        // Random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)

        }
        // Xử lí phát lại một bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat= !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // xử lí next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }else{
            nextBtn.click()
            }        
        }
        // lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
           const songNode = e.target.closest('.song:not(.active')
            if(!e.target.closest('.option')){
                // Xử lí khi click vào song 
                if(songNode){
                  _this.currentIndex = Number(songNode.dataset.index)
                  _this.loadCurrentSong()
                  _this.render()
                    audio.play()
                }
                // Xử lí khi click vào song option
                if(e.target.closest('.option')){

                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        },300)
    },
    loadCurrentSong: function() {      
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex>= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        newIndex = Math.floor(Math.random() * this.songs.length);
        if(count > 0){
            do {
                newIndex = Math.floor(Math.random() * this.songs.length)
                var isCheck = arrayTemp.includes(newIndex);
            }while(isCheck == true)
        }
       arrayTemp[count] = newIndex;
       this.currentIndex = newIndex;
       this.loadCurrentSong()
       if(count == this.songs.length-1){
        arrayTemp = [];
        count =-1;
       }
       count++;
    },
    start: function() {
        //  gán cấu hinhg từ config vao ung dung
        this.loadConfig()
        // Định nghĩa cac thuộc tính cho object
        this.defineProperties()
        //  Lắng nghe các sự kiện (DOM event)
        this.handlerEvents()
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng Dụng
        this.loadCurrentSong()
        // Render playlist
        this.render();
        //  Hiển thị trạng thái ban đầu của random va repeat
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start()
